/**
 * eslint.config.js
 * ESLint 9+ flat config format
 * Purpose: Define linting rules for VNEIL-GENESIS project
 */

const js = require('@eslint/js');

module.exports = [
  // Apply to all JavaScript files
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', '*.min.js', 'public/app.js', 'WWW.VERTYXNEXUS.PL/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        // CommonJS
        exports: 'writable',
      },
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'error',
    },
  },
  // Apply recommended rules
  js.configs.recommended,
];
