/**
 * MODULE: PackDemoZip
 *
 * Purpose: Create demo.zip archive with essential demo files
 *
 * Assumptions:
 * - archiver, fs, and path modules are available
 * - Source files (index.js, package.json, public/, README_DEMO.md) exist
 * - Write permissions in parent directory
 *
 * Invariants:
 * - Creates demo.zip in parent directory
 * - Includes exactly: index.js, package.json, public/, README_DEMO.md
 * - Exits with 0 on success, 1 on failure
 * - No throws - all errors are caught and logged
 *
 * Failure Modes:
 * - Missing source files: logs warning, continues (ENOENT)
 * - Write permission error: logs error, exits with code 1
 * - Archive error: logs error, exits with code 1
 *
 * Example:
 *   node scripts/pack.js
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Main function to create demo archive
 * @returns {void}
 */
function createDemoZip() {
  const outputPath = path.resolve(__dirname, '..', 'demo.zip');

  // Fail-fast: Check if output directory is writable
  try {
    const testPath = path.resolve(__dirname, '..', '.write-permission-test');
    fs.writeFileSync(testPath, '');
    try {
      fs.unlinkSync(testPath);
    } catch (cleanupErr) {
      // Log but don't fail on cleanup error
      console.warn(`Warning: Could not remove test file: ${cleanupErr.message}`);
    }
  } catch (err) {
    console.error(`Error: Cannot write to output directory: ${err.message}`);
    process.exit(1);
  }

  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  let hasError = false;

  output.on('close', () => {
    if (!hasError) {
      console.log(`✅ Created ${outputPath} (${archive.pointer()} total bytes)`);
      process.exit(0);
    }
  });

  output.on('error', err => {
    console.error(`Error writing archive: ${err.message}`);
    hasError = true;
    process.exit(1);
  });

  archive.on('warning', err => {
    if (err.code === 'ENOENT') {
      console.warn(`Warning: File not found: ${err.message}`);
    } else {
      console.error(`Archive warning: ${err.message}`);
      hasError = true;
      process.exit(1);
    }
  });

  archive.on('error', err => {
    console.error(`Archive error: ${err.message}`);
    hasError = true;
    process.exit(1);
  });

  archive.pipe(output);

  // Include runtime files for demo
  const filesToInclude = [
    { src: 'index.js', dest: 'index.js' },
    { src: 'package.json', dest: 'package.json' },
    { src: 'README_DEMO.md', dest: 'README_DEMO.md' },
  ];

  filesToInclude.forEach(({ src, dest }) => {
    const srcPath = path.resolve(__dirname, '..', src);
    if (fs.existsSync(srcPath)) {
      archive.file(srcPath, { name: dest });
    } else {
      console.warn(`Warning: Skipping missing file: ${src}`);
    }
  });

  // Include public directory
  const publicPath = path.resolve(__dirname, '..', 'public');
  if (fs.existsSync(publicPath)) {
    archive.directory(publicPath, 'public');
  } else {
    console.warn('Warning: Skipping missing directory: public/');
  }

  archive.finalize();
}

// Execute only if run directly
if (require.main === module) {
  createDemoZip();
}

// Export for testing
module.exports = { createDemoZip };
