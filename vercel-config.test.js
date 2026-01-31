/**
 * vercel-config.test.js
 * Purpose: Validate vercel.json configuration for syntax and structure
 * Assumptions: vercel.json exists and is valid JSON
 * Invariants: Configuration must have required fields (version, builds, routes)
 * Failure modes: Invalid JSON, missing required fields, invalid structure
 * Example: node vercel-config.test.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// ============================================================================
// Test Utilities
// ============================================================================

let testsPassed = 0;
let testsFailed = 0;
let testsRun = 0;

function test(description, fn) {
  testsRun++;
  try {
    fn();
    console.log(`✅ ${description}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${description}`);
    console.error(`   ${error.message}`);
    testsFailed++;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Loads and parses vercel.json
 * @returns {object} Parsed configuration
 */
function loadVercelConfig() {
  const configPath = path.join(__dirname, 'vercel.json');
  const content = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(content);
}

/**
 * Validates vercel.json structure
 * @param {object} config - Configuration object
 * @returns {object} Validation result {valid: boolean, errors: string[]}
 */
function validateVercelConfig(config) {
  const errors = [];

  // Check version
  if (!config.version || typeof config.version !== 'number') {
    errors.push('Missing or invalid "version" field');
  }

  // Check builds
  if (!Array.isArray(config.builds)) {
    errors.push('Missing or invalid "builds" field (must be array)');
  } else {
    config.builds.forEach((build, index) => {
      if (!build.src || typeof build.src !== 'string') {
        errors.push(`Build[${index}] missing or invalid "src" field`);
      }
      if (!build.use || typeof build.use !== 'string') {
        errors.push(`Build[${index}] missing or invalid "use" field`);
      }
    });
  }

  // Check routes
  if (!Array.isArray(config.routes)) {
    errors.push('Missing or invalid "routes" field (must be array)');
  } else {
    config.routes.forEach((route, index) => {
      if (!route.src || typeof route.src !== 'string') {
        errors.push(`Route[${index}] missing or invalid "src" field`);
      }
      if (!route.dest || typeof route.dest !== 'string') {
        errors.push(`Route[${index}] missing or invalid "dest" field`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

// ============================================================================
// Test Suite: vercel.json Validation
// ============================================================================

test('vercel.json is valid JSON', () => {
  const config = loadVercelConfig();
  assert.ok(config, 'Config should be loaded');
  assert.strictEqual(typeof config, 'object', 'Config should be an object');
});

test('vercel.json has version field', () => {
  const config = loadVercelConfig();
  assert.ok(config.version, 'Version field should exist');
  assert.strictEqual(typeof config.version, 'number', 'Version should be a number');
  assert.strictEqual(config.version, 2, 'Version should be 2');
});

test('vercel.json has builds array', () => {
  const config = loadVercelConfig();
  assert.ok(Array.isArray(config.builds), 'Builds should be an array');
  assert.ok(config.builds.length > 0, 'Builds should not be empty');
});

test('vercel.json builds have required fields', () => {
  const config = loadVercelConfig();
  config.builds.forEach((build, index) => {
    assert.ok(build.src, `Build[${index}] should have src field`);
    assert.ok(build.use, `Build[${index}] should have use field`);
    assert.strictEqual(typeof build.src, 'string', `Build[${index}].src should be string`);
    assert.strictEqual(typeof build.use, 'string', `Build[${index}].use should be string`);
  });
});

test('vercel.json has routes array', () => {
  const config = loadVercelConfig();
  assert.ok(Array.isArray(config.routes), 'Routes should be an array');
  assert.ok(config.routes.length > 0, 'Routes should not be empty');
});

test('vercel.json routes have required fields', () => {
  const config = loadVercelConfig();
  config.routes.forEach((route, index) => {
    assert.ok(route.src, `Route[${index}] should have src field`);
    assert.ok(route.dest, `Route[${index}] should have dest field`);
    assert.strictEqual(typeof route.src, 'string', `Route[${index}].src should be string`);
    assert.strictEqual(typeof route.dest, 'string', `Route[${index}].dest should be string`);
  });
});

test('vercel.json has security headers', () => {
  const config = loadVercelConfig();
  assert.ok(Array.isArray(config.headers), 'Headers should be an array');
  assert.ok(config.headers.length > 0, 'Headers should not be empty');

  const securityHeaders = config.headers[0].headers;
  assert.ok(securityHeaders, 'Security headers should exist');

  const headerKeys = securityHeaders.map(h => h.key);
  assert.ok(headerKeys.includes('Content-Security-Policy'), 'Should have Content-Security-Policy');
  assert.ok(headerKeys.includes('X-Content-Type-Options'), 'Should have X-Content-Type-Options');
  assert.ok(headerKeys.includes('X-Frame-Options'), 'Should have X-Frame-Options');
  assert.ok(headerKeys.includes('X-XSS-Protection'), 'Should have X-XSS-Protection');
});

test('vercel.json environment variables', () => {
  const config = loadVercelConfig();
  assert.ok(config.env, 'Environment variables should exist');
  assert.strictEqual(typeof config.env, 'object', 'Env should be an object');
});

test('validateVercelConfig returns valid for correct config', () => {
  const config = loadVercelConfig();
  const result = validateVercelConfig(config);
  assert.strictEqual(result.valid, true, 'Config should be valid');
  assert.strictEqual(result.errors.length, 0, 'Should have no errors');
});

test('validateVercelConfig is deterministic', () => {
  const config = loadVercelConfig();
  const result1 = validateVercelConfig(config);
  const result2 = validateVercelConfig(config);
  assert.deepStrictEqual(result1, result2, 'Results should be identical');
});

test('validateVercelConfig detects missing version', () => {
  const invalidConfig = { builds: [], routes: [] };
  const result = validateVercelConfig(invalidConfig);
  assert.strictEqual(result.valid, false, 'Config should be invalid');
  assert.ok(result.errors.length > 0, 'Should have errors');
  assert.ok(
    result.errors.some(e => e.includes('version')),
    'Should mention version error'
  );
});

test('validateVercelConfig detects invalid builds', () => {
  const invalidConfig = { version: 2, builds: 'not-an-array', routes: [] };
  const result = validateVercelConfig(invalidConfig);
  assert.strictEqual(result.valid, false, 'Config should be invalid');
  assert.ok(
    result.errors.some(e => e.includes('builds')),
    'Should mention builds error'
  );
});

// ============================================================================
// Test Summary
// ============================================================================

console.log('');
console.log('==================================================');
console.log(`Tests run: ${testsRun}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log('==================================================');

if (testsFailed === 0) {
  console.log('');
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('');
  console.log(`❌ ${testsFailed} test(s) failed`);
  process.exit(1);
}
