/**
 * MODULE: TSVNETemplateTests
 * 
 * Purpose: Unit tests for TSVNE template module demonstrating TSVNE principles
 * 
 * Assumptions:
 * - Node.js built-in 'assert' module is available
 * - tsvne-template.js is in the same directory
 * 
 * Invariants:
 * - All tests are deterministic and repeatable
 * - Each test is isolated (no shared state)
 * - Exit code 0 = success, non-zero = failure
 * 
 * Failure Modes:
 * - Assertion failure exits with code 1
 * - Module load failure exits with code 2
 * 
 * Example:
 *   node tsvne-template.test.js
 */

const assert = require('assert');

// Load module to test
let template;
try {
  template = require('./tsvne-template');
} catch (err) {
  console.error('Failed to load tsvne-template module:', err.message);
  process.exit(2);
}

const {
  calculateDiscount,
  validateEmail,
  processBatch,
  getConfig
} = template;

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
// Test Suite 1: calculateDiscount - Happy Path
// ============================================================================

test('calculateDiscount computes correct discount', () => {
  const result = calculateDiscount(100, 0.2);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.value, 80);
  assert.strictEqual(result.details.discountAmount, 20);
});

test('calculateDiscount handles zero discount', () => {
  const result = calculateDiscount(50, 0);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.value, 50);
});

test('calculateDiscount handles full discount', () => {
  const result = calculateDiscount(100, 1);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.value, 0);
});

// ============================================================================
// Test Suite 2: calculateDiscount - Fail-Fast Tests
// ============================================================================

test('calculateDiscount rejects non-number price', () => {
  const result = calculateDiscount('100', 0.2);
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('number'));
});

test('calculateDiscount rejects negative price', () => {
  const result = calculateDiscount(-10, 0.2);
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('negative'));
});

test('calculateDiscount rejects NaN price', () => {
  const result = calculateDiscount(NaN, 0.2);
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
});

test('calculateDiscount rejects invalid discount rate', () => {
  const result = calculateDiscount(100, 1.5);
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('between'));
});

test('calculateDiscount rejects negative discount rate', () => {
  const result = calculateDiscount(100, -0.1);
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
});

// ============================================================================
// Test Suite 3: calculateDiscount - Determinism Tests
// ============================================================================

test('calculateDiscount is deterministic', () => {
  const result1 = calculateDiscount(100, 0.15);
  const result2 = calculateDiscount(100, 0.15);
  assert.deepStrictEqual(result1, result2);
});

test('calculateDiscount produces identical output for same input', () => {
  const inputs = [
    [100, 0.1],
    [200, 0.25],
    [50.5, 0.5]
  ];

  inputs.forEach(([price, rate]) => {
    const r1 = calculateDiscount(price, rate);
    const r2 = calculateDiscount(price, rate);
    assert.deepStrictEqual(r1, r2);
  });
});

// ============================================================================
// Test Suite 4: validateEmail - Happy Path
// ============================================================================

test('validateEmail accepts valid email', () => {
  const result = validateEmail('user@example.com');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.value, 'user@example.com');
});

test('validateEmail normalizes email to lowercase', () => {
  const result = validateEmail('User@Example.COM');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.value, 'user@example.com');
});

test('validateEmail trims whitespace', () => {
  const result = validateEmail('  test@test.com  ');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.value, 'test@test.com');
});

// ============================================================================
// Test Suite 5: validateEmail - Fail-Fast Tests
// ============================================================================

test('validateEmail rejects non-string input', () => {
  const result = validateEmail(12345);
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('string'));
});

test('validateEmail rejects empty string', () => {
  const result = validateEmail('');
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('empty'));
});

test('validateEmail rejects invalid format', () => {
  const result = validateEmail('not-an-email');
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('format'));
});

test('validateEmail rejects email without domain', () => {
  const result = validateEmail('user@');
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
});

// ============================================================================
// Test Suite 6: validateEmail - Determinism Tests
// ============================================================================

test('validateEmail is deterministic', () => {
  const email = 'test@example.com';
  const result1 = validateEmail(email);
  const result2 = validateEmail(email);
  assert.deepStrictEqual(result1, result2);
});

// ============================================================================
// Test Suite 7: processBatch - Happy Path
// ============================================================================

test('processBatch transforms items correctly', () => {
  const items = [1, 2, 3];
  const transform = (x) => x * 2;
  const result = processBatch(items, transform);

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.count, 3);
  assert.strictEqual(result.value[0].transformed, 2);
  assert.strictEqual(result.value[1].transformed, 4);
  assert.strictEqual(result.value[2].transformed, 6);
});

test('processBatch handles empty array', () => {
  const result = processBatch([], (x) => x);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.count, 0);
});

test('processBatch preserves original values', () => {
  const items = ['a', 'b'];
  const transform = (x) => x.toUpperCase();
  const result = processBatch(items, transform);

  assert.strictEqual(result.value[0].original, 'a');
  assert.strictEqual(result.value[0].transformed, 'A');
});

// ============================================================================
// Test Suite 8: processBatch - Fail-Fast Tests
// ============================================================================

test('processBatch rejects non-array items', () => {
  const result = processBatch('not-array', (x) => x);
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('array'));
});

test('processBatch rejects non-function transform', () => {
  const result = processBatch([1, 2], 'not-function');
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('function'));
});

test('processBatch handles transformation errors', () => {
  const items = [1, 2];
  const badTransform = (x) => {
    if (x === 2) throw new Error('Bad value');
    return x;
  };

  const result = processBatch(items, badTransform);
  assert.strictEqual(result.success, false);
  assert.ok(result.error.includes('failed'));
});

// ============================================================================
// Test Suite 9: processBatch - Determinism Tests
// ============================================================================

test('processBatch is deterministic', () => {
  const items = [5, 10, 15];
  const transform = (x) => x / 5;

  const result1 = processBatch(items, transform);
  const result2 = processBatch(items, transform);

  assert.deepStrictEqual(result1, result2);
});

// ============================================================================
// Test Suite 10: getConfig - SSOT Tests
// ============================================================================

test('getConfig retrieves configuration value', () => {
  const value = getConfig('maxDiscountRate');
  assert.strictEqual(value, 0.9);
});

test('getConfig returns undefined for unknown key', () => {
  const value = getConfig('unknownKey');
  assert.strictEqual(value, undefined);
});

test('getConfig handles non-string key', () => {
  const value = getConfig(123);
  assert.strictEqual(value, undefined);
});

test('getConfig is deterministic', () => {
  const value1 = getConfig('minPrice');
  const value2 = getConfig('minPrice');
  assert.strictEqual(value1, value2);
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
