const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const request = require('supertest');
const app = require('../src/app');
const openApiSpec = require('../docs/openapi.json');

describe('API Tests', () => {
  test('GET / returns correct response', async () => {
    const res = await request(app).get('/');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.message, 'CI/CD Demo API');
    assert.equal(res.body.version, openApiSpec.info.version);
  });

  test('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'healthy');
    assert.equal(typeof res.body.uptime, 'number');
  });

  test('GET /openapi.json exposes the API contract used by the app', async () => {
    const res = await request(app).get('/openapi.json');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.openapi, '3.0.3');
    assert.ok(res.body.paths['/']);
    assert.ok(res.body.paths['/health']);
  });
});
