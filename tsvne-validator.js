/**
 * MODULE: TSVNEValidator
 *
 * Purpose: Validate JavaScript modules for TSVNE compliance
 *
 * Assumptions:
 * - Input is a string containing JavaScript code
 * - Basic compliance checks (header, structure, patterns)
 * - Not a full AST parser (use ESLint for deeper analysis)
 *
 * Invariants:
 * - Always returns { compliant: boolean, issues: string[], score: number }
 * - Score is 0-100 (100 = fully compliant)
 * - Deterministic: same code → same result
 * - No side effects (pure function)
 *
 * Failure Modes:
 * - Returns { compliant: false, issues: [...] } for non-compliant code
 * - Never throws exceptions
 *
 * Example:
 *   const code = "function add(a, b) { return a + b; }";
 *   const result = validateTSVNE(code);
 *   console.log(result); // { compliant: false, issues: [...], score: 40 }
 */

/**
 * Validate TSVNE compliance of JavaScript code
 * @param {string} code - JavaScript code to validate
 * @returns {Object} Validation result with compliant, issues, and score
 */
function validateTSVNE(code) {
  // Fail-fast validation
  if (typeof code !== 'string') {
    return {
      compliant: false,
      issues: ['Code must be a string'],
      score: 0,
    };
  }

  if (code.trim().length === 0) {
    return {
      compliant: false,
      issues: ['Code is empty'],
      score: 0,
    };
  }

  // Collect issues
  const issues = [];
  let score = 100;

  // Check 1: Module header (Purpose, Assumptions, Invariants, etc.)
  if (!hasModuleHeader(code)) {
    issues.push('Missing module header with Purpose/Assumptions/Invariants');
    score -= 30;
  }

  // Check 2: Fail-fast patterns
  if (!hasFailFastPattern(code)) {
    issues.push('No fail-fast validation detected (missing early input checks)');
    score -= 20;
  }

  // Check 3: Avoid console.log with sensitive data patterns
  if (hasSensitiveLogging(code)) {
    issues.push('Potential sensitive data in console.log (password, token, secret, key)');
    score -= 25;
  }

  // Check 4: Global state mutation patterns
  if (hasGlobalStateMutation(code)) {
    issues.push('Detected potential global state mutation (let/var at module level)');
    score -= 15;
  }

  // Check 5: Has exports (module structure)
  if (!hasExports(code)) {
    issues.push('No module.exports or export statement detected');
    score -= 10;
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine compliance (threshold: 70%)
  const compliant = score >= 70;

  return {
    compliant,
    issues,
    score,
  };
}

/**
 * Check if code has a proper module header
 * @param {string} code - Code to check
 * @returns {boolean} True if header exists
 */
function hasModuleHeader(code) {
  // Look for comment block with key TSVNE elements
  const headerPatterns = [
    /\/\*\*[\s\S]*?Purpose:/i,
    /\/\*\*[\s\S]*?Assumptions:/i,
    /\/\*\*[\s\S]*?Invariants:/i,
  ];

  return headerPatterns.every(pattern => pattern.test(code));
}

/**
 * Check if code has fail-fast validation patterns
 * @param {string} code - Code to check
 * @returns {boolean} True if fail-fast patterns detected
 */
function hasFailFastPattern(code) {
  // Look for early return/throw on invalid input
  const patterns = [
    /if\s*\([^)]*\)\s*{\s*(throw|return)/,
    /if\s*\(!\w+\)\s*(throw|return)/,
    /if\s*\(\w+\s*===\s*(null|undefined)\)\s*(throw|return)/,
  ];

  return patterns.some(pattern => pattern.test(code));
}

/**
 * Check for sensitive data in logging
 * @param {string} code - Code to check
 * @returns {boolean} True if sensitive logging detected
 */
function hasSensitiveLogging(code) {
  // Check for console.log with sensitive keywords
  const sensitiveKeywords = ['password', 'token', 'secret', 'key', 'credential'];
  const logPattern = /console\.(log|error|warn|info)\s*\([^)]*\)/gi;

  const logs = code.match(logPattern) || [];

  return logs.some(log => {
    const lowerLog = log.toLowerCase();
    return sensitiveKeywords.some(keyword => lowerLog.includes(keyword));
  });
}

/**
 * Check for global state mutation
 * @param {string} code - Code to check
 * @returns {boolean} True if global mutation detected
 *
 * Note: This is a simplified heuristic check, not a full AST parser.
 * It may have false positives/negatives. For production use, integrate
 * with ESLint or similar tools for accurate scope analysis.
 */
function hasGlobalStateMutation(code) {
  // Look for let/var at module level (outside functions)
  // Improved to handle more function patterns
  const lines = code.split('\n');
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.length === 0) {
      continue;
    }

    // Track braces (approximation of scope depth)
    braceDepth += (trimmed.match(/{/g) || []).length;
    braceDepth -= (trimmed.match(/}/g) || []).length;

    // Check for let/var at module level (depth 0)
    // Only flag if we're not inside any braces (functions, blocks, etc.)
    if (braceDepth === 0 && (trimmed.startsWith('let ') || trimmed.startsWith('var '))) {
      return true;
    }
  }

  return false;
}

/**
 * Check if code has exports
 * @param {string} code - Code to check
 * @returns {boolean} True if exports detected
 */
function hasExports(code) {
  const exportPatterns = [
    /module\.exports/,
    /exports\.\w+/,
    /export\s+(default|const|function|class)/,
  ];

  return exportPatterns.some(pattern => pattern.test(code));
}

/**
 * Generate a compliance report
 * @param {Object} result - Validation result from validateTSVNE
 * @returns {string} Human-readable report
 */
function generateReport(result) {
  if (typeof result !== 'object' || result === null) {
    return 'Invalid result object';
  }

  let report = '=== TSVNE Compliance Report ===\n\n';
  report += `Status: ${result.compliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}\n`;
  report += `Score: ${result.score}/100\n\n`;

  if (result.issues.length > 0) {
    report += 'Issues Found:\n';
    result.issues.forEach((issue, idx) => {
      report += `  ${idx + 1}. ${issue}\n`;
    });
  } else {
    report += 'No issues found. Excellent TSVNE compliance!\n';
  }

  report += '\n=== End of Report ===\n';

  return report;
}

// Module exports
module.exports = {
  validateTSVNE,
  generateReport,
  // Export helpers for testing
  hasModuleHeader,
  hasFailFastPattern,
  hasSensitiveLogging,
  hasGlobalStateMutation,
  hasExports,
};

// CLI execution
if (require.main === module) {
  const fs = require('fs');
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node tsvne-validator.js <file.js>');
    process.exit(1);
  }

  const filePath = args[0];

  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = validateTSVNE(code);
    const report = generateReport(result);

    console.log(report);
    process.exit(result.compliant ? 0 : 1);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(2);
  }
}
