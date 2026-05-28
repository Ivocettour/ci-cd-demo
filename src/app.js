const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'CI/CD Demo API',
    status: 'ok',
    version: '1.0.0',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

module.exports = app;
