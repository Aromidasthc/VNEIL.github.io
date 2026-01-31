/**
 * MODULE: TSVNEValidatorTests
 * 
 * Purpose: Unit tests for TSVNE validator module
 * 
 * Assumptions:
 * - Node.js built-in 'assert' module is available
 * - tsvne-validator.js is in the same directory
 * 
 * Invariants:
 * - Tests are deterministic and repeatable
 * - Each test is isolated (no shared state)
 * - Exit code 0 = all tests pass, non-zero = failure
 * 
 * Failure Modes:
 * - Assertion failure exits with code 1
 * - Module load failure exits with code 2
 * 
 * Example:
 *   node tsvne-validator.test.js
 */

const assert = require('assert');

// Load module to test
let validator;
try {
  validator = require('./tsvne-validator');
} catch (err) {
  console.error('Failed to load tsvne-validator module:', err.message);
  process.exit(2);
}

const {
  validateTSVNE,
  generateReport,
  hasModuleHeader,
  hasFailFastPattern,
  hasSensitiveLogging,
  hasGlobalStateMutation,
  hasExports
} = validator;

// Test counter
let testsRun = 0;
let testsPassed = 0;

/**
 * Test helper function
 * @param {string} name - Test name
 * @param {Function} testFn - Test function
 */
function test(name, testFn) {
  testsRun++;
  try {
    testFn();
    testsPassed++;
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(`   ${err.message}`);
  }
}

// ============================================================================
// Test Suite 1: validateTSVNE - Fail-Fast Tests
// ============================================================================

test('validateTSVNE rejects non-string input', () => {
  const result = validateTSVNE(123);
  assert.strictEqual(result.compliant, false);
  assert.strictEqual(result.score, 0);
  assert.ok(result.issues.some(i => i.includes('string')));
});

test('validateTSVNE rejects empty string', () => {
  const result = validateTSVNE('');
  assert.strictEqual(result.compliant, false);
  assert.strictEqual(result.score, 0);
  assert.ok(result.issues.some(i => i.includes('empty')));
});

// ============================================================================
// Test Suite 2: validateTSVNE - Module Header Detection
// ============================================================================

test('validateTSVNE detects missing module header', () => {
  const code = `
    function add(a, b) {
      return a + b;
    }
    module.exports = { add };
  `;
  const result = validateTSVNE(code);
  assert.ok(result.issues.some(i => i.includes('header')));
});

test('hasModuleHeader returns true for complete header', () => {
  const code = `
    /**
     * Purpose: Test module
     * Assumptions: Valid inputs
     * Invariants: Pure functions
     */
  `;
  assert.strictEqual(hasModuleHeader(code), true);
});

test('hasModuleHeader returns false for incomplete header', () => {
  const code = `
    /**
     * Purpose: Test module
     */
  `;
  assert.strictEqual(hasModuleHeader(code), false);
});

// ============================================================================
// Test Suite 3: validateTSVNE - Fail-Fast Pattern Detection
// ============================================================================

test('hasFailFastPattern detects early return', () => {
  const code = `
    function test(value) {
      if (!value) return { error: 'Invalid' };
      return { success: true };
    }
  `;
  assert.strictEqual(hasFailFastPattern(code), true);
});

test('hasFailFastPattern detects early throw', () => {
  const code = `
    function test(value) {
      if (value === null) throw new Error('Null value');
      return value;
    }
  `;
  assert.strictEqual(hasFailFastPattern(code), true);
});

test('hasFailFastPattern returns false when no fail-fast', () => {
  const code = `
    function test(value) {
      const result = value * 2;
      return result;
    }
  `;
  assert.strictEqual(hasFailFastPattern(code), false);
});

// ============================================================================
// Test Suite 4: validateTSVNE - Sensitive Logging Detection
// ============================================================================

test('hasSensitiveLogging detects password in log', () => {
  const code = `console.log('User password:', password);`;
  assert.strictEqual(hasSensitiveLogging(code), true);
});

test('hasSensitiveLogging detects token in log', () => {
  const code = `console.error('API token failed:', token);`;
  assert.strictEqual(hasSensitiveLogging(code), true);
});

test('hasSensitiveLogging returns false for safe logging', () => {
  const code = `console.log('User logged in successfully');`;
  assert.strictEqual(hasSensitiveLogging(code), false);
});

// ============================================================================
// Test Suite 5: validateTSVNE - Global State Mutation Detection
// ============================================================================

test('hasGlobalStateMutation detects let at module level', () => {
  const code = `
    let counter = 0;
    function increment() { counter++; }
  `;
  assert.strictEqual(hasGlobalStateMutation(code), true);
});

test('hasGlobalStateMutation detects var at module level', () => {
  const code = `
    var state = {};
    function setState(s) { state = s; }
  `;
  assert.strictEqual(hasGlobalStateMutation(code), true);
});

test('hasGlobalStateMutation allows const at module level', () => {
  const code = `
    const CONFIG = { port: 3000 };
    function getPort() { return CONFIG.port; }
  `;
  assert.strictEqual(hasGlobalStateMutation(code), false);
});

// ============================================================================
// Test Suite 6: validateTSVNE - Exports Detection
// ============================================================================

test('hasExports detects module.exports', () => {
  const code = `module.exports = { test };`;
  assert.strictEqual(hasExports(code), true);
});

test('hasExports detects exports assignment', () => {
  const code = `exports.test = function() {};`;
  assert.strictEqual(hasExports(code), true);
});

test('hasExports detects ES6 export', () => {
  const code = `export function test() {}`;
  assert.strictEqual(hasExports(code), true);
});

test('hasExports returns false when no exports', () => {
  const code = `function test() {}`;
  assert.strictEqual(hasExports(code), false);
});

// ============================================================================
// Test Suite 7: validateTSVNE - Integration Tests
// ============================================================================

test('validateTSVNE returns compliant for TSVNE-compliant code', () => {
  const code = `
    /**
     * Purpose: Test function
     * Assumptions: Valid inputs
     * Invariants: Pure function
     */
    function test(value) {
      if (!value) throw new Error('Invalid');
      return value * 2;
    }
    module.exports = { test };
  `;
  const result = validateTSVNE(code);
  assert.strictEqual(result.compliant, true);
  assert.ok(result.score >= 70);
});

test('validateTSVNE is deterministic', () => {
  const code = `function test() { return 42; }`;
  const result1 = validateTSVNE(code);
  const result2 = validateTSVNE(code);
  assert.deepStrictEqual(result1, result2);
});

// ============================================================================
// Test Suite 8: generateReport Tests
// ============================================================================

test('generateReport produces string output', () => {
  const result = {
    compliant: true,
    issues: [],
    score: 100
  };
  const report = generateReport(result);
  assert.strictEqual(typeof report, 'string');
  assert.ok(report.includes('COMPLIANT'));
});

test('generateReport handles invalid input gracefully', () => {
  const report = generateReport(null);
  assert.strictEqual(typeof report, 'string');
  assert.ok(report.includes('Invalid'));
});

test('generateReport lists issues', () => {
  const result = {
    compliant: false,
    issues: ['Issue 1', 'Issue 2'],
    score: 50
  };
  const report = generateReport(result);
  assert.ok(report.includes('Issue 1'));
  assert.ok(report.includes('Issue 2'));
});

// ============================================================================
// Test Summary
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log(`Tests run: ${testsRun}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsRun - testsPassed}`);
console.log('='.repeat(50));

if (testsPassed === testsRun) {
  console.log('\n✅ All tests passed!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
}
