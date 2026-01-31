const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const outputPath = path.resolve(__dirname, '..', 'demo.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created ${outputPath} (${archive.pointer()} total bytes)`);
});

archive.on('warning', err => {
  if (err.code === 'ENOENT') console.warn(err);
  else throw err;
});

archive.on('error', err => { throw err; });

archive.pipe(output);

// Include runtime files for demo
archive.file(path.resolve(__dirname, '..', 'index.js'), { name: 'index.js' });
archive.file(path.resolve(__dirname, '..', 'package.json'), { name: 'package.json' });
archive.directory(path.resolve(__dirname, '..', 'public'), 'public');
archive.file(path.resolve(__dirname, '..', 'README_DEMO.md'), { name: 'README_DEMO.md' });

archive.finalize();
