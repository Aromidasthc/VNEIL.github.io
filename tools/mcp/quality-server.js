#!/usr/bin/env node
/**
 * MCP Quality Server (single-file)
 * Exposes strict, audit-friendly tools for CI-like checks:
 * - run_lint, run_typecheck, run_tests, run_security_scan, summarize_failures
 *
 * Transport: stdio (JSON-RPC-like messages) – compatible with GitHub Copilot coding agent MCP "local" server.
 * Notes:
 * - No secrets are printed.
 * - Commands are allowlisted via env vars to avoid arbitrary execution.
 */

const { spawn } = require('node:child_process');
const os = require('node:os');

function nowIso() {
  return new Date().toISOString();
}

function safeTrim(s, max = 20000) {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max) + '\n…(truncated)…';
}

function redactSecrets(text) {
  // Basic redaction for common token patterns. Add org-specific patterns if needed.
  if (!text) return '';
  const patterns = [
    /ghp_[A-Za-z0-9]{20,}/g,
    /github_pat_[A-Za-z0-9_]{20,}/g,
    /xox[baprs]-[A-Za-z0-9-]{10,}/g,
    /AIza[0-9A-Za-z\-_]{20,}/g,
    /sk-[A-Za-z0-9]{20,}/g,
    /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g,
  ];
  let out = text;
  for (const re of patterns) out = out.replace(re, '[REDACTED]');
  return out;
}

function parseCommandEnv(key, fallback) {
  const v = process.env[key];
  if (!v || !v.trim()) return fallback;
  return v.trim();
}

/**
 * Allowlist commands via env vars so the server can't be used to run arbitrary shell.
 * You can override these in MCP config env if needed.
 */
const COMMANDS = {
  lint: parseCommandEnv('QUALITY_LINT_CMD', 'npm run -s lint'),
  typecheck: parseCommandEnv('QUALITY_TYPECHECK_CMD', 'npm run -s typecheck'),
  tests: parseCommandEnv('QUALITY_TEST_CMD', 'npm test -s'),
  security: parseCommandEnv('QUALITY_SECURITY_CMD', 'npm audit --audit-level=moderate'),
};

function spawnShell(command, cwd) {
  // Use platform-appropriate shell
  const isWin = os.platform() === 'win32';
  const shell = isWin ? 'cmd.exe' : 'bash';
  const args = isWin ? ['/d', '/s', '/c', command] : ['-lc', command];

  return new Promise(resolve => {
    const child = spawn(shell, args, {
      cwd: cwd || process.cwd(),
      env: {
        ...process.env,
        // Normalize CI behavior
        CI: process.env.CI || 'true',
        // Reduce noisy colors
        FORCE_COLOR: '0',
        NO_COLOR: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', d => (stdout += d.toString()));
    child.stderr.on('data', d => (stderr += d.toString()));

    child.on('close', code => {
      const out = redactSecrets(safeTrim(stdout));
      const err = redactSecrets(safeTrim(stderr));
      resolve({
        ok: code === 0,
        exitCode: code ?? -1,
        stdout: out,
        stderr: err,
      });
    });
  });
}

function toolResult(name, run, extra = {}) {
  return {
    tool: name,
    ts: nowIso(),
    ...extra,
    ...run,
  };
}

/**
 * Very lightweight failure summarizer.
 * Extracts:
 * - first lines with "error"/"fail"/"warning"
 * - common JS/TS patterns
 */
function summarizeText(text, maxLines = 40) {
  const lines = (text || '').split(/\r?\n/);
  const hits = [];
  const re = /(error|fail|failed|exception|warning|traceback|panic)/i;

  for (const line of lines) {
    if (re.test(line)) hits.push(line);
    if (hits.length >= maxLines) break;
  }
  return hits.join('\n');
}

/** MCP over stdio minimal implementation **/

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function sendError(id, message, data) {
  send({
    jsonrpc: '2.0',
    id,
    error: { code: -32000, message, data },
  });
}

function sendResult(id, result) {
  send({
    jsonrpc: '2.0',
    id,
    result,
  });
}

const TOOLS = {
  run_lint: {
    description: 'Run lint command (allowlisted).',
    inputSchema: {
      type: 'object',
      properties: {
        cwd: { type: 'string', description: 'Working directory (optional)' },
      },
      additionalProperties: false,
    },
    async call(args) {
      const run = await spawnShell(COMMANDS.lint, args?.cwd);
      return toolResult('run_lint', run, {
        command: COMMANDS.lint,
        cwd: args?.cwd || process.cwd(),
      });
    },
  },

  run_typecheck: {
    description: 'Run typecheck command (allowlisted).',
    inputSchema: {
      type: 'object',
      properties: {
        cwd: { type: 'string', description: 'Working directory (optional)' },
      },
      additionalProperties: false,
    },
    async call(args) {
      const run = await spawnShell(COMMANDS.typecheck, args?.cwd);
      return toolResult('run_typecheck', run, {
        command: COMMANDS.typecheck,
        cwd: args?.cwd || process.cwd(),
      });
    },
  },

  run_tests: {
    description: 'Run test command (allowlisted).',
    inputSchema: {
      type: 'object',
      properties: {
        cwd: { type: 'string', description: 'Working directory (optional)' },
      },
      additionalProperties: false,
    },
    async call(args) {
      const run = await spawnShell(COMMANDS.tests, args?.cwd);
      return toolResult('run_tests', run, {
        command: COMMANDS.tests,
        cwd: args?.cwd || process.cwd(),
      });
    },
  },

  run_security_scan: {
    description: 'Run dependency/security scan (allowlisted).',
    inputSchema: {
      type: 'object',
      properties: {
        cwd: { type: 'string', description: 'Working directory (optional)' },
      },
      additionalProperties: false,
    },
    async call(args) {
      const run = await spawnShell(COMMANDS.security, args?.cwd);
      return toolResult('run_security_scan', run, {
        command: COMMANDS.security,
        cwd: args?.cwd || process.cwd(),
      });
    },
  },

  summarize_failures: {
    description: 'Summarize failures from tool outputs (stdout/stderr).',
    inputSchema: {
      type: 'object',
      properties: {
        outputs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tool: { type: 'string' },
              ok: { type: 'boolean' },
              exitCode: { type: 'number' },
              stdout: { type: 'string' },
              stderr: { type: 'string' },
            },
            required: ['tool', 'ok', 'exitCode', 'stdout', 'stderr'],
            additionalProperties: true,
          },
        },
      },
      required: ['outputs'],
      additionalProperties: false,
    },
    async call(args) {
      const outputs = args?.outputs || [];
      const failing = outputs.filter(o => !o.ok);

      const summary = failing.map(o => {
        const combined = `${o.stdout || ''}\n${o.stderr || ''}`;
        const extracted = summarizeText(combined);
        return {
          tool: o.tool,
          exitCode: o.exitCode,
          highlights: extracted || '(no obvious error lines found)',
        };
      });

      return {
        tool: 'summarize_failures',
        ts: nowIso(),
        failingCount: failing.length,
        failingTools: failing.map(o => o.tool),
        summary,
      };
    },
  },
};

async function handle(msg) {
  const { id, method, params } = msg || {};
  if (!method) return sendError(id ?? null, 'Missing method');

  if (method === 'initialize') {
    return sendResult(id, {
      serverInfo: { name: 'mcp-quality-server', version: '1.0.0' },
      capabilities: {
        tools: true,
      },
    });
  }

  if (method === 'tools/list') {
    const tools = Object.entries(TOOLS).map(([name, t]) => ({
      name,
      description: t.description,
      inputSchema: t.inputSchema,
    }));
    return sendResult(id, { tools });
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};
    const tool = TOOLS[toolName];
    if (!tool) return sendError(id, `Unknown tool: ${toolName}`);

    try {
      const result = await tool.call(args);
      // MCP "tools/call" expects "content" array in many clients; keep it simple and compatible:
      return sendResult(id, {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
        // Also return raw result for agents that can use it:
        raw: result,
      });
    } catch (e) {
      return sendError(id, `Tool failed: ${toolName}`, { message: String(e?.message || e) });
    }
  }

  return sendError(id, `Unknown method: ${method}`);
}

// Main loop: one JSON per line on stdin
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async chunk => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;

    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      sendError(null, 'Invalid JSON input');
      continue;
    }
    await handle(msg);
  }
});

process.stdin.on('end', () => process.exit(0));
