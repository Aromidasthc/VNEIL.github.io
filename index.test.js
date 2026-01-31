/**
 * MODULE: IndexServerTests
 * 
 * Purpose: Unit tests for index.js demo server
 * 
 * Assumptions:
 * - Node.js built-in 'assert' module is available
 * - index.js is in the same directory
 * - Express module is installed
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
 *   node index.test.js
 */

const assert = require('assert');

// Load module to test
let indexModule;
try {
  indexModule = require('./index');
} catch (err) {
  console.error('Failed to load index module:', err.message);
  process.exit(2);
}

const { getPort } = indexModule;

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
// Test Suite 1: getPort - Default Behavior
// ============================================================================

test('getPort returns 3000 when PORT is not set', () => {
  // Save original PORT
  const originalPort = process.env.PORT;
  
  // Clear PORT
  delete process.env.PORT;
  
  const port = getPort();
  assert.strictEqual(port, 3000);
  
  // Restore original PORT
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  }
});

// ============================================================================
// Test Suite 2: getPort - Valid PORT Values
// ============================================================================

test('getPort returns valid numeric PORT', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '8080';
  const port = getPort();
  assert.strictEqual(port, 8080);
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

test('getPort handles minimum valid port', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '1';
  const port = getPort();
  assert.strictEqual(port, 1);
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

test('getPort handles maximum valid port', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '65535';
  const port = getPort();
  assert.strictEqual(port, 65535);
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

// ============================================================================
// Test Suite 3: getPort - Invalid PORT Values (Fail-Fast)
// ============================================================================

test('getPort rejects non-numeric PORT', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = 'invalid';
  const port = getPort();
  assert.strictEqual(port, 3000); // Should fallback to default
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

test('getPort rejects port 0', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '0';
  const port = getPort();
  assert.strictEqual(port, 3000); // Should fallback to default
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

test('getPort rejects negative port', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '-100';
  const port = getPort();
  assert.strictEqual(port, 3000); // Should fallback to default
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

test('getPort rejects port above 65535', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '99999';
  const port = getPort();
  assert.strictEqual(port, 3000); // Should fallback to default
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

// ============================================================================
// Test Suite 4: getPort - Edge Cases
// ============================================================================

test('getPort handles PORT with whitespace', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '  8080  ';
  const port = getPort();
  assert.strictEqual(port, 8080); // parseInt handles leading/trailing whitespace
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

test('getPort handles PORT with decimal', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '8080.5';
  const port = getPort();
  assert.strictEqual(port, 8080); // parseInt truncates decimal
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
});

// ============================================================================
// Test Suite 5: getPort - Determinism
// ============================================================================

test('getPort is deterministic with same input', () => {
  const originalPort = process.env.PORT;
  
  process.env.PORT = '5000';
  const port1 = getPort();
  const port2 = getPort();
  assert.strictEqual(port1, port2);
  
  if (originalPort !== undefined) {
    process.env.PORT = originalPort;
  } else {
    delete process.env.PORT;
  }
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
