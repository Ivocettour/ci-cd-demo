const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const jsFiles = [
  'api/index.js',
  'eslint.config.js',
  'scripts/validate-openapi.js',
  'scripts/validate-syntax.js',
  'src/app.js',
  'src/index.js',
  '__tests__/app.test.js'
];

const jsonFiles = [
  'docs/openapi.json',
  'package.json',
  'vercel.json'
];

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], {
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    throw new Error(`JavaScript syntax check failed: ${file}`);
  }
}

for (const file of jsonFiles) {
  const fullPath = path.join(root, file);
  JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

console.log('JavaScript and JSON syntax are valid.');
