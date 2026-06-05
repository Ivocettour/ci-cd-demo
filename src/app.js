const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CI/CD Demo API'
  });
});

app.get('/home', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CI/CDd Pipeline Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0d1117;
      color: #e6edf3;
      font-family: 'Segoe UI', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 16px;
      padding: 48px 56px;
      text-align: center;
      max-width: 520px;
      width: 90%;
    }
    .badge {
      display: inline-block;
      background: rgba(63,185,80,0.15);
      color: #3fb950;
      border: 1px solid rgba(63,185,80,0.3);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      padding: 4px 14px;
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    .pulse {
      display: inline-block;
      width: 8px; height: 8px;
      background: #3fb950;
      border-radius: 50%;
      margin-right: 6px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.4); }
    }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    h1 span { color: #58a6ff; }
    .subtitle { color: #8b949e; font-size: 14px; margin-bottom: 36px; }
    .pipeline {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 36px;
    }
    .step {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
    }
    .step.green { border-color: rgba(63,185,80,0.4); color: #3fb950; }
    .step.blue  { border-color: rgba(88,166,255,0.4); color: #58a6ff; }
    .step.purple{ border-color: rgba(188,140,255,0.4); color: #bc8cff; }
    .arrow { color: #30363d; font-size: 16px; }
    .info {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .info-box {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 14px 10px;
    }
    .info-box .label { font-size: 11px; color: #8b949e; margin-bottom: 4px; }
    .info-box .value { font-size: 15px; font-weight: 700; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="pulse"></span>deployed</div>
    <h1>CI/CD <span>Pipeline</span> Demo</h1>
    <p class="subtitle">Desplegado automáticamente con GitHub Actions</p>

    <div class="pipeline">
      <div class="step green">✅ Test</div>
      <div class="arrow">→</div>
      <div class="step blue">🐳 Build</div>
      <div class="arrow">→</div>
      <div class="step purple">🚀 Deploy</div>
    </div>

    <div class="info">
      <div class="info-box">
        <div class="label">Versión</div>
        <div class="value" style="color:#58a6ff">v1.0.0</div>
      </div>
      <div class="info-box">
        <div class="label">Estado</div>
        <div class="value" style="color:#3fb950">Online</div>
      </div>
      <div class="info-box">
        <div class="label">Cobertura</div>
        <div class="value" style="color:#bc8cff">100%</div>
      </div>
    </div>
  </div>
</body>
</html>`);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

module.exports = app;
