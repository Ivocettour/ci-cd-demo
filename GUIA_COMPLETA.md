# 🚀 Proyecto CI/CD — Guía Completa de Implementación

## 1. ARQUITECTURA DEL PROYECTO

```
GitHub Push → GitHub Actions → Tests (Jest) → Build (Docker) → Deploy (Render)
```

**Herramientas utilizadas:**
- **GitHub** — Repositorio de código
- **GitHub Actions** — Servidor de Integración Continua
- **Node.js + Express** — Aplicación backend simple
- **Jest + Supertest** — Tests automatizados
- **Docker** — Empaquetado y build
- **Render** — Deploy automático en la nube (gratis)

---

## 2. ESTRUCTURA DE CARPETAS

```
ci-cd-demo/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          ← Pipeline CI/CD
├── src/
│   ├── app.js                 ← Lógica de la app
│   └── index.js               ← Punto de entrada
├── __tests__/
│   └── app.test.js            ← Tests automatizados
├── Dockerfile                 ← Imagen Docker
├── render.yaml                ← Config de deploy
├── package.json               ← Dependencias Node.js
└── .gitignore
```

---

## 3. PASOS EXACTOS PARA IMPLEMENTARLO

### Paso 1 — Crear el repositorio en GitHub
```bash
# En tu máquina local
git init ci-cd-demo
cd ci-cd-demo
# Copiar todos los archivos del proyecto aquí
```

### Paso 2 — Instalar dependencias y probar localmente
```bash
npm install
npm test
```
Deberías ver:
```
PASS  __tests__/app.test.js
  API Tests
    ✓ GET / returns correct response
    ✓ GET /health returns healthy
```

### Paso 3 — Construir y correr con Docker (local)
```bash
docker build -t ci-cd-demo .
docker run -p 3000:3000 ci-cd-demo
# Abrir http://localhost:3000
```

### Paso 4 — Subir a GitHub
```bash
git add .
git commit -m "feat: initial CI/CD setup"
git remote add origin https://github.com/TU_USUARIO/ci-cd-demo.git
git push -u origin main
```
→ GitHub Actions se dispara automáticamente.

### Paso 5 — Configurar Render (deploy gratuito)
1. Ir a https://render.com → Sign up con GitHub
2. New → Web Service → conectar tu repo `ci-cd-demo`
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
4. Copiar el **Deploy Hook URL** de Settings → Deploy Hooks
5. En GitHub → Settings → Secrets → `RENDER_DEPLOY_HOOK_URL` → pegar la URL

### Paso 6 — Verificar que el pipeline funciona
```bash
# Hacer un cambio pequeño
echo "# Updated" >> README.md
git add . && git commit -m "test: trigger pipeline"
git push
```
→ Ir a GitHub → Actions → ver el pipeline correr en vivo.

---

## 4. CÓMO DEMOSTRAR EN VIVO (demo de 5 minutos)

### Orden recomendado:

**[0:00 - 0:30] Mostrar la arquitectura** (la diapositiva)
> "Cada vez que hago push, pasan 3 cosas automáticas: test, build y deploy."

**[0:30 - 1:30] Mostrar el código** (GitHub)
> "Esta es la app — una API REST minimalista con 2 endpoints."
> Mostrar `src/app.js` (10 líneas) y `__tests__/app.test.js`

**[1:30 - 2:30] Mostrar el pipeline YAML**
> "Este archivo `.github/workflows/ci-cd.yml` define los 3 jobs."
> Señalar: `test → build → deploy` con `needs:`

**[2:30 - 3:30] HACER UN PUSH EN VIVO**
```bash
# En la terminal
echo "// demo push $(date)" >> src/app.js
git add . && git commit -m "demo: live push for presentation"
git push
```
→ Inmediatamente abrir GitHub → Actions y mostrar el pipeline corriendo.

**[3:30 - 4:30] Mostrar el deploy en Render**
> Abrir https://tu-app.onrender.com en el navegador.
> Mostrar el JSON: `{"message":"CI/CD Demo API","status":"ok"}`

**[4:30 - 5:00] Conclusión**
> "En menos de 2 minutos, el código pasó de mi máquina a producción, 100% automático."

---

## 5. SPEECH PARA LA EXPOSICIÓN

> "Buenos días. Voy a presentar un proyecto de Integración Continua y Despliegue Continuo, lo que en la industria se conoce como CI/CD.
>
> El objetivo es simple pero poderoso: cada vez que un desarrollador sube código a GitHub, el sistema automáticamente ejecuta los tests, construye la aplicación con Docker, y la despliega en la nube sin intervención humana.
>
> Las herramientas que elegí son las mismas que usan empresas reales: GitHub Actions como servidor CI, Docker para garantizar que 'funciona en mi máquina' equivale a 'funciona en producción', y Render como plataforma de deployment gratuita.
>
> La ventaja de este flujo es que si un test falla, el pipeline se detiene y nunca llega código roto a producción. Es la base del desarrollo moderno ágil.
>
> Ahora les voy a mostrar cómo funciona en tiempo real."

---

## 6. PREGUNTAS TEÓRICAS Y RESPUESTAS

**¿Qué diferencia hay entre CI y CD?**
> CI (Integración Continua) = integrar y testear el código automáticamente en cada push.
> CD (Despliegue Continuo) = llevar automáticamente ese código validado a producción.

**¿Por qué usar Docker?**
> Docker garantiza que el entorno de desarrollo y producción sean idénticos. Elimina el problema de "funciona en mi máquina pero no en el servidor".

**¿Qué pasa si un test falla?**
> El pipeline se detiene en el job `test`. Los jobs `build` y `deploy` no corren. El código roto nunca llega a producción.

**¿Qué es un workflow de GitHub Actions?**
> Es un archivo YAML que define jobs y steps que se ejecutan automáticamente ante eventos como un `push` o `pull request`.

**¿Por qué `needs: test` en el job build?**
> Es una dependencia explícita. Le dice a GitHub Actions que el job `build` solo puede correr si `test` terminó exitosamente. Así se garantiza el orden y la seguridad del pipeline.

**¿Qué es un Deploy Hook?**
> Es una URL secreta de Render que al recibir un HTTP POST, dispara un nuevo deployment. Funciona como un webhook de deployment.

**¿Qué ventaja tiene esto sobre hacer deploy manual?**
> Velocidad, consistencia y confiabilidad. No hay error humano, todos los deploys pasan por los mismos tests, y el historial queda documentado automáticamente en GitHub.

---

## 7. CÓMO HACERLO PARECER MÁS AVANZADO

- Mostrar el **tab de Actions** con el pipeline corriendo → impacto visual inmediato
- Decir "jobs paralelos vs secuenciales" aunque sea un pipeline simple
- Mencionar "si esto fuera producción real, agregaríamos Slack notifications y rollback automático"
- Mostrar el **coverage report** de Jest: `npm test -- --coverage`
- Abrir el **log en tiempo real** del deploy en Render
- Usar el término "artifact" para los reportes de test
- Mencionar "seguimos GitFlow con branch protection rules"
