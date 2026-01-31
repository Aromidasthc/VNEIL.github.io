/**
 * MODULE: ExampleTSVNEModule
 * 
 * Purpose: Template for TSVNE-compliant modules demonstrating best practices
 * 
 * Assumptions:
 * - Input data types are validated at function boundaries
 * - Functions operate in isolation without shared mutable state
 * - All operations are synchronous (async version would need Promise handling)
 * 
 * Invariants:
 * - All exported functions are pure (same input → same output)
 * - No side effects except explicit logging to stdout/stderr
 * - All functions return structured objects with success/error status
 * - Input validation happens before business logic (fail-fast)
 * 
 * Failure Modes:
 * - Invalid inputs return { success: false, error: <description> }
 * - Never throws exceptions (returns error objects instead)
 * - Logs critical errors to stderr without exposing sensitive data
 * 
 * Example:
 *   const { calculateDiscount } = require('./tsvne-template');
 *   const result = calculateDiscount(100, 0.1);
 *   if (result.success) {
 *     console.log(`Discounted price: ${result.value}`);
 *   } else {
 *     console.error(`Error: ${result.error}`);
 *   }
 */

/**
 * Calculate discounted price
 * @param {number} price - Original price
 * @param {number} discountRate - Discount rate (0.0 to 1.0)
 * @returns {Object} Result object with success status and value or error
 */
function calculateDiscount(price, discountRate) {
  // Fail-fast: validate price
  if (typeof price !== 'number' || isNaN(price)) {
    return {
      success: false,
      error: 'Price must be a valid number'
    };
  }

  if (price < 0) {
    return {
      success: false,
      error: 'Price cannot be negative'
    };
  }

  // Fail-fast: validate discountRate
  if (typeof discountRate !== 'number' || isNaN(discountRate)) {
    return {
      success: false,
      error: 'Discount rate must be a valid number'
    };
  }

  if (discountRate < 0 || discountRate > 1) {
    return {
      success: false,
      error: 'Discount rate must be between 0 and 1'
    };
  }

  // Deterministic calculation
  const discountAmount = price * discountRate;
  const finalPrice = price - discountAmount;
  
  // Round to 2 decimal places to avoid floating point artifacts
  const roundedFinalPrice = Math.round(finalPrice * 100) / 100;
  const roundedDiscountAmount = Math.round(discountAmount * 100) / 100;

  // Return auditable result
  return {
    success: true,
    value: roundedFinalPrice,
    details: {
      originalPrice: price,
      discountRate,
      discountAmount: roundedDiscountAmount,
      finalPrice: roundedFinalPrice
    }
  };
}

/**
 * Validate email format (simplified RFC 5322)
 * @param {string} email - Email address to validate
 * @returns {Object} Validation result with success and message
 */
function validateEmail(email) {
  // Fail-fast: check type
  if (typeof email !== 'string') {
    return {
      success: false,
      error: 'Email must be a string'
    };
  }

  // Normalize: trim whitespace
  const trimmedEmail = email.trim();

  // Fail-fast: check empty
  if (trimmedEmail.length === 0) {
    return {
      success: false,
      error: 'Email cannot be empty'
    };
  }

  // Deterministic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(trimmedEmail);

  if (!isValid) {
    return {
      success: false,
      error: 'Invalid email format'
    };
  }

  // Success
  return {
    success: true,
    value: trimmedEmail.toLowerCase(),
    message: 'Valid email format'
  };
}

/**
 * Process a batch of items with a transformation function
 * @param {Array} items - Array of items to process
 * @param {Function} transformFn - Pure transformation function
 * @returns {Object} Result with success status and processed items or error
 */
function processBatch(items, transformFn) {
  // Fail-fast: validate items
  if (!Array.isArray(items)) {
    return {
      success: false,
      error: 'Items must be an array'
    };
  }

  // Fail-fast: validate transform function
  if (typeof transformFn !== 'function') {
    return {
      success: false,
      error: 'Transform function must be a function'
    };
  }

  // Process items deterministically
  try {
    const processed = items.map((item, index) => {
      return {
        index,
        original: item,
        transformed: transformFn(item)
      };
    });

    return {
      success: true,
      value: processed,
      count: processed.length
    };
  } catch (err) {
    // Safe error handling (no sensitive data exposure)
    return {
      success: false,
      error: `Processing failed: ${err.message}`
    };
  }
}

/**
 * Configuration object (SSOT pattern)
 * Centralized configuration to avoid duplication
 */
const CONFIG = {
  maxDiscountRate: 0.9,
  minPrice: 0.01,
  emailMaxLength: 254,
  batchMaxSize: 1000
};

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value or undefined
 */
function getConfig(key) {
  if (typeof key !== 'string') {
    return undefined;
  }
  return CONFIG[key];
}

// Module exports (explicit and minimal)
module.exports = {
  calculateDiscount,
  validateEmail,
  processBatch,
  getConfig
};
