const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const request = require('supertest');
const app = require('../src/app');
const openApiSpec = require('../docs/openapi.json');

describe('API Tests', () => {
  test('GET / returns correct response', async () => {
    const res = await request(app).get('/');
    assert.equal(res.statusCode, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.message, 'CI/CD Demo API');
    assert.equal(res.body.version, openApiSpec.info.version);
  });

  test('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.statusCode, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    assert.equal(res.body.status, 'healthy');
    assert.equal(typeof res.body.uptime, 'number');
  });

  test('GET /home returns the demo HTML page', async () => {
    const res = await request(app).get('/home');
    assert.equal(res.statusCode, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.match(res.text, /CI\/CD Pipeline Demo/);
    assert.match(res.text, /OpenAPI/);
    assert.match(res.text, /Vercel/);
  });

  test('GET /openapi.json exposes the API contract used by the app', async () => {
    const res = await request(app).get('/openapi.json');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.openapi, '3.0.3');
    assert.ok(res.body.paths['/']);
    assert.ok(res.body.paths['/health']);
    assert.ok(res.body.paths['/home']);
  });

  test('GET unknown route returns a JSON 404 response', async () => {
    const res = await request(app).get('/missing-route');
    assert.equal(res.statusCode, 404);
    assert.match(res.headers['content-type'], /application\/json/);
    assert.equal(res.body.status, 'not_found');
    assert.match(res.body.message, /missing-route/);
  });
});
