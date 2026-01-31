/**
 * MODULE: PackDemoTar
 * 
 * Purpose: Create demo.tar.gz archive with essential demo files
 * 
 * Assumptions:
 * - tar, fs, and path modules are available
 * - Source files (index.js, package.json, public/, README_DEMO.md) exist
 * - Write permissions in parent directory
 * 
 * Invariants:
 * - Creates demo.tar.gz in parent directory
 * - Uses gzip compression
 * - Exits with 0 on success, 1 on failure
 * - No unhandled promise rejections
 * 
 * Failure Modes:
 * - Missing source files: tar operation fails with error
 * - Write permission error: logs error, exits with code 1
 * - Tar operation error: logs error, exits with code 1
 * 
 * Example:
 *   node scripts/pack-tar.js
 */

const tar = require('tar');
const path = require('path');
const fs = require('fs');

/**
 * Create tar.gz archive with demo files
 * @returns {Promise<void>}
 */
async function createTar() {
  // Fail-fast: Validate that source directory exists
  const sourceDir = path.resolve(__dirname, '..');
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Error: Source directory does not exist');
    process.exit(1);
  }
  
  // Fail-fast: Check write permissions
  const dest = path.resolve(sourceDir, 'demo.tar.gz');
  try {
    const testPath = path.resolve(sourceDir, '.write-permission-test');
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
  
  // Validate that source files exist
  const filesToInclude = ['index.js', 'package.json', 'public', 'README_DEMO.md'];
  const existingFiles = filesToInclude.filter(file => {
    const fullPath = path.resolve(sourceDir, file);
    return fs.existsSync(fullPath);
  });
  
  if (existingFiles.length === 0) {
    console.error('Error: No source files found to archive');
    process.exit(1);
  }
  
  if (existingFiles.length < filesToInclude.length) {
    const missing = filesToInclude.filter(f => !existingFiles.includes(f));
    console.warn(`Warning: Missing files will be skipped: ${missing.join(', ')}`);
  }
  
  try {
    await tar.c(
      {
        gzip: true,
        file: dest,
        cwd: sourceDir
      },
      existingFiles
    );
    console.log(`✅ Created ${dest}`);
    process.exit(0);
  } catch (err) {
    console.error(`Error creating tar archive: ${err.message}`);
    process.exit(1);
  }
}

// Execute only if run directly
if (require.main === module) {
  createTar().catch(err => {
    console.error(`Unhandled error: ${err.message}`);
    process.exit(1);
  });
}

// Export for testing
module.exports = { createTar };
