const tar = require('tar');
const path = require('path');

async function createTar() {
  const dest = path.resolve(__dirname, '..', 'demo.tar.gz');
  await tar.c(
    {
      gzip: true,
      file: dest,
      cwd: path.resolve(__dirname, '..')
    },
    ['index.js', 'package.json', 'public', 'README_DEMO.md']
  );
  console.log(`Created ${dest}`);
}

createTar().catch(err => { console.error(err); process.exit(1); });
