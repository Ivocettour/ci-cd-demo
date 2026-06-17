const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const contractPath = path.join(__dirname, '..', 'docs', 'openapi.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

const requiredPaths = ['/', '/health', '/home', '/openapi.json'];

assert.equal(contract.openapi, '3.0.3', 'OpenAPI version must be 3.0.3');
assert.ok(contract.info?.title, 'OpenAPI info.title is required');
assert.ok(contract.info?.version, 'OpenAPI info.version is required');
assert.ok(contract.paths, 'OpenAPI paths object is required');

for (const route of requiredPaths) {
  assert.ok(contract.paths[route], `OpenAPI path ${route} is required`);
  assert.ok(contract.paths[route].get, `OpenAPI path ${route} must define GET`);
}

assert.ok(
  contract.components?.schemas?.RootResponse,
  'RootResponse schema is required'
);
assert.ok(
  contract.components?.schemas?.HealthResponse,
  'HealthResponse schema is required'
);

console.log('OpenAPI contract is valid.');
