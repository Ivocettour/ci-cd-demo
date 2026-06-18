const express = require('express');
const openApiSpec = require('../docs/openapi.json');

cont app = express();

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CI/CD Demo API',
    version: openApiSpec.info.version
  });
});

app.get('/home', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CI/CD Pipeline Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f6f8fa;
      color: #24292f;
      font-family: Inter, 'Segoe UI', Arial, sans-serif;
      min-height: 100vh;
      padding: 32px;
    }
    .shell {
      max-width: 960px;
      margin: 0 auto;
    }
    .hero {
      background: #ffffff;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      padding: 32px;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      background: #dafbe1;
      color: #1a7f37;
      border: 1px solid #aceebb;
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
      background: #1a7f37;
      border-radius: 50%;
      margin-right: 6px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.4); }
    }
    h1 { font-size: 34px; font-weight: 800; margin-bottom: 8px; }
    h1 span { color: #0969da; }
    .subtitle { color: #57606a; font-size: 16px; max-width: 680px; line-height: 1.5; }
    .pipeline {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      margin: 24px 0;
      flex-wrap: wrap;
    }
    .step {
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
    }
    .step.green { border-color: #aceebb; color: #1a7f37; background: #dafbe1; }
    .step.blue  { border-color: #80ccff; color: #0969da; background: #ddf4ff; }
    .step.purple{ border-color: #d8b9ff; color: #8250df; background: #fbefff; }
    .arrow { color: #8c959f; font-size: 16px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .panel {
      background: #ffffff;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      padding: 18px;
    }
    .label { font-size: 12px; color: #57606a; margin-bottom: 6px; text-transform: uppercase; font-weight: 700; }
    .value { font-size: 18px; font-weight: 800; }
    .links {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    a {
      color: #0969da;
      text-decoration: none;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      padding: 10px 12px;
      font-weight: 700;
      background: #ffffff;
    }
    a:hover { background: #f6f8fa; }
    @media (max-width: 720px) {
      body { padding: 16px; }
      .hero { padding: 24px; }
      h1 { font-size: 28px; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
    <div class="badge"><span class="pulse"></span>production ready</div>
    <h1>CI/CD <span>Pipeline</span> Demo</h1>
    <p class="subtitle">API Express validada con lint, contrato OpenAPI, tests automatizados, build Docker y despliegue continuo en Vercel.</p>

    <div class="pipeline" aria-label="Etapas del pipeline">
      <div class="step green">Lint</div>
      <div class="arrow">-&gt;</div>
      <div class="step green">OpenAPI</div>
      <div class="arrow">-&gt;</div>
      <div class="step green">Tests</div>
      <div class="arrow">-&gt;</div>
      <div class="step blue">Docker Build</div>
      <div class="arrow">-&gt;</div>
      <div class="step purple">Deploy</div>
    </div>
    </section>

    <section class="grid" aria-label="Estado de la aplicacion">
      <div class="panel">
        <div class="label">Version</div>
        <div class="value" style="color:#58a6ff">v${openApiSpec.info.version}</div>
      </div>
      <div class="panel">
        <div class="label">Estado</div>
        <div class="value" style="color:#3fb950">Online</div>
      </div>
      <div class="panel">
        <div class="label">Contrato</div>
        <div class="value" style="color:#bc8cff">OpenAPI</div>
      </div>
    </section>

    <nav class="links" aria-label="Enlaces de verificacion">
      <a href="/">API root</a>
      <a href="/health">Health check</a>
      <a href="/openapi.json">OpenAPI</a>
    </nav>
  </main>
</body>
</html>`);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime()
  });
});

app.get('/openapi.json', (req, res) => {
  res.json(openApiSpec);
});

app.use((req, res) => {
  res.status(404).json({
    status: 'not_found',
    message: `Route ${req.path} not found`
  });
});

module.exports = app;
