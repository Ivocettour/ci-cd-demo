# Exposicion detallada del proyecto CI/CD

Este documento sirve como apoyo para presentar el proyecto. Esta escrito para poder estudiar, explicar y defender las decisiones tecnicas frente a una evaluacion de Integracion Continua y Entrega Continua.

---

## 1. Idea general del proyecto

El proyecto es una API desarrollada con Node.js y Express. Su objetivo no es ser una aplicacion grande, sino demostrar un flujo completo y realista de CI/CD.

CI/CD significa:

- CI: Integracion Continua.
- CD: Entrega Continua o Despliegue Continuo.

En este proyecto, cada cambio que se sube a GitHub puede pasar automaticamente por controles de calidad:

1. Instalacion limpia de dependencias.
2. Analisis estatico del codigo.
3. Validacion del contrato OpenAPI.
4. Ejecucion de tests automatizados.
5. Build local.
6. Construccion de imagen Docker.
7. Smoke test del contenedor.
8. Generacion de artefactos.
9. Despliegue en Vercel.

La idea principal es evitar que un cambio roto llegue a produccion. Si falla el lint, el contrato, los tests o Docker, el pipeline se detiene.

---

## 2. Stack tecnologico

El proyecto usa:

- Node.js 20.x como runtime.
- Express como framework HTTP.
- node:test como test runner.
- node:assert/strict para aserciones.
- Supertest para probar endpoints HTTP.
- ESLint para analisis estatico.
- OpenAPI para especificar el contrato de la API.
- Docker para empaquetado y validacion de entorno.
- Docker Compose para ejecucion local del contenedor.
- GitHub Actions para CI/CD.
- Vercel como plataforma de despliegue.

La eleccion es coherente porque el proyecto es una API simple. No se usa un framework frontend ni una arquitectura innecesariamente compleja.

---

## 3. Estructura importante del repositorio

Archivos principales:

```text
src/app.js
src/index.js
api/index.js
__tests__/app.test.js
docs/openapi.json
scripts/validate-openapi.js
.github/workflows/ci.yml
Dockerfile
docker-compose.yml
vercel.json
README.md
GUIA_COMPLETA.md
```

Explicacion:

- `src/app.js`: define la aplicacion Express y sus rutas.
- `src/index.js`: levanta el servidor local con `app.listen`.
- `api/index.js`: adapta la app Express para Vercel.
- `__tests__/app.test.js`: contiene los tests automatizados.
- `docs/openapi.json`: contiene el contrato OpenAPI.
- `scripts/validate-openapi.js`: valida que el contrato tenga estructura minima.
- `.github/workflows/ci.yml`: define el pipeline.
- `Dockerfile`: construye una imagen reproducible.
- `docker-compose.yml`: permite ejecutar localmente la app en contenedor.
- `vercel.json`: configura el deploy en Vercel.

---

## 4. Funcionamiento de la API

Endpoints:

| Endpoint | Funcion |
| --- | --- |
| `GET /` | Devuelve estado general de la API. |
| `GET /health` | Health check para verificar que el servicio esta vivo. |
| `GET /home` | Pagina visual para mostrar el pipeline. |
| `GET /openapi.json` | Publica el contrato OpenAPI. |
| Ruta inexistente | Devuelve error JSON `404`. |

Ejemplo de `/`:

```json
{
  "status": "ok",
  "message": "CI/CD Demo API",
  "version": "1.0.0"
}
```

Ejemplo de `/health`:

```json
{
  "status": "healthy",
  "uptime": 12.34
}
```

Ejemplo de ruta inexistente:

```json
{
  "status": "not_found",
  "message": "Route /missing-route not found"
}
```

---

## 5. Explicacion de la pagina visual

La ruta `/home` muestra una pagina HTML de demostracion. Sirve para que la exposicion no dependa solamente de respuestas JSON.

La pagina muestra:

- estado `production ready`;
- nombre del proyecto;
- descripcion del flujo CI/CD;
- etapas: Lint, OpenAPI, Tests, Docker Build y Deploy;
- version;
- estado online;
- contrato OpenAPI;
- links rapidos a `/`, `/health` y `/openapi.json`.

Esto ayuda durante la presentacion porque se puede abrir la URL desplegada en Vercel y mostrar visualmente que la aplicacion esta viva.

---

## 6. Que es CI en este proyecto

CI significa Integracion Continua.

En este proyecto, la integracion continua se ve en el job `quality` de GitHub Actions.

Ese job:

1. Descarga el codigo.
2. Configura Node.js 20.
3. Instala dependencias con `npm ci`.
4. Ejecuta ESLint.
5. Valida OpenAPI.
6. Ejecuta tests.
7. Ejecuta build local.
8. Publica el contrato OpenAPI como artefacto.

La idea es que cada push o pull request sea validado automaticamente.

Frase para exposicion:

> "La integracion continua me permite detectar errores apenas subo codigo, antes de mezclarlo o desplegarlo."

---

## 7. Que es CD en este proyecto

CD significa Entrega Continua o Despliegue Continuo.

En este proyecto, el despliegue se hace a Vercel.

El job `deploy`:

1. Solo corre en push a `main`.
2. Depende de que pasen quality y Docker.
3. Usa Vercel CLI.
4. Usa secrets de GitHub.
5. Ejecuta `vercel pull`, `vercel build --prod` y `vercel deploy --prebuilt --prod`.

Frase para exposicion:

> "El despliegue no se hace manualmente desde mi computadora. Lo hace el pipeline despues de validar el codigo."

---

## 8. Explicacion profunda de los tests

Esta es una parte muy importante para defender el proyecto.

Archivo:

```text
__tests__/app.test.js
```

Comando:

```bash
npm test
```

En Windows:

```bash
npm.cmd test
```

---

## 9. Que tipo de tests son

Los tests del proyecto son principalmente tests automatizados de API.

Tambien se pueden llamar:

- tests de endpoints HTTP;
- tests funcionales de API;
- tests de integracion livianos;
- smoke tests automatizados;
- tests de contrato parcial.

### Tipos de test que conviene conocer

Para explicar bien el proyecto, es util distinguir varios tipos de pruebas. No todos se implementan en este repositorio, pero conocerlos ayuda a justificar el alcance.

#### Test unitario

Un test unitario prueba una unidad pequena de codigo de forma aislada. Esa unidad puede ser una funcion, un metodo o un modulo simple.

Ejemplo conceptual:

```text
Una funcion calcularTotal(100, 0.21) debe devolver 121.
```

Caracteristicas:

- Es muy rapido.
- No deberia depender de red, base de datos ni servidor real.
- Sirve para detectar errores en logica interna.
- Normalmente usa mocks o datos falsos.

En nuestro proyecto no hay muchos tests unitarios puros porque la logica principal no esta en funciones matematicas o reglas complejas, sino en endpoints HTTP.

#### Test de integracion

Un test de integracion verifica que varias partes del sistema funcionen correctamente juntas.

Ejemplo:

```text
La app Express recibe una request, ejecuta la ruta correcta y devuelve JSON esperado.
```

Caracteristicas:

- Prueba colaboracion entre componentes.
- Puede incluir framework web, rutas, middlewares y respuestas.
- Es mas realista que un test unitario.
- Puede ser mas lento que un unitario, pero da mas confianza sobre el comportamiento real.

Nuestros tests son de integracion livianos porque integran Express, rutas, respuestas HTTP, contrato OpenAPI y manejo de errores, pero no dependen de base de datos ni servicios externos.

#### Test funcional

Un test funcional verifica una funcionalidad desde el punto de vista del comportamiento esperado.

Ejemplo:

```text
Cuando consulto GET /health, la API debe responder status healthy.
```

Caracteristicas:

- Se enfoca en que la funcionalidad cumpla el requisito.
- No se preocupa tanto por como esta implementada internamente.
- Es facil de explicar porque se relaciona con casos de uso.

Nuestros tests tambien son funcionales porque validan comportamientos observables: la raiz responde, el health check funciona, la pagina HTML existe, el contrato se publica y el 404 es controlado.

#### Test de API

Un test de API prueba endpoints HTTP directamente.

Ejemplo:

```text
GET /openapi.json debe responder 200 y devolver un documento OpenAPI.
```

Caracteristicas:

- Verifica codigos HTTP.
- Verifica headers como `content-type`.
- Verifica cuerpo de respuesta JSON o HTML.
- Es ideal para backend y servicios REST.

Este es el tipo de test mas representativo de nuestro proyecto. Usamos Supertest para hacer requests contra la app Express sin levantar un servidor real en un puerto.

#### Smoke test

Un smoke test es una prueba rapida y superficial que confirma que lo mas importante del sistema enciende y responde.

El nombre viene de una idea simple: si al prender una maquina sale humo, ni siquiera vale la pena seguir probando. En software significa:

```text
Antes de hacer validaciones profundas, confirmo que la aplicacion arranca y responde algo basico.
```

Ejemplo:

```text
GET /health debe responder 200.
```

Caracteristicas:

- Es corto y rapido.
- No prueba todos los detalles.
- Sirve para detectar fallos graves temprano.
- Se usa mucho despues de un deploy o al levantar un contenedor.

En nuestro proyecto hay smoke tests en dos niveles:

1. En tests automatizados, `/health` confirma que la API esta viva.
2. En Docker/GitHub Actions, se levanta la imagen y se consulta `/health` para confirmar que el contenedor responde.

Frase para exposicion:

> "El smoke test no busca probar todo el sistema; busca confirmar rapidamente que lo esencial funciona."

#### Test de contrato

Un test de contrato verifica que una API respete una especificacion acordada.

En nuestro proyecto, el contrato esta en:

```text
docs/openapi.json
```

Y se publica en:

```text
GET /openapi.json
```

Caracteristicas:

- Ayuda a mantener coherencia entre documentacion y codigo.
- Evita que la API cambie sin actualizar su especificacion.
- Es muy util cuando otros sistemas consumen la API.

Nuestro proyecto tiene contrato OpenAPI y dos formas de validarlo:

1. `npm run validate:openapi`, que revisa la estructura minima del archivo.
2. El test `GET /openapi.json`, que verifica que la API publique el contrato y que incluya rutas esperadas.

#### Test end-to-end o E2E

Un test end-to-end prueba un flujo completo como lo haria un usuario final.

Ejemplo:

```text
Abrir navegador, entrar a la web, completar formulario, enviar, ver resultado.
```

Caracteristicas:

- Usa herramientas como Playwright, Cypress o Selenium.
- Prueba el sistema desde la interfaz real.
- Da mucha confianza, pero suele ser mas lento y fragil.

Nuestro proyecto no implementa E2E completo porque es una API sencilla y no tiene una aplicacion frontend compleja. La pagina `/home` se prueba como respuesta HTML, pero no con navegador real.

#### Test de regresion

Un test de regresion busca asegurar que algo que ya funcionaba no se rompa con cambios nuevos.

Ejemplo:

```text
Antes /health respondia healthy; despues de modificar la app debe seguir respondiendo healthy.
```

Caracteristicas:

- Puede ser unitario, de integracion, API o E2E.
- Su objetivo es evitar que errores viejos vuelvan.
- Es clave en CI/CD.

Nuestros tests funcionan tambien como tests de regresion: cada push vuelve a comprobar que endpoints importantes siguen funcionando.

#### Test de carga o performance

Un test de carga mide como se comporta la aplicacion con muchas requests o usuarios simultaneos.

Ejemplo:

```text
Enviar 1000 requests por minuto y medir tiempo de respuesta.
```

Caracteristicas:

- Evalua rendimiento.
- Puede detectar cuellos de botella.
- Se usa mas en proyectos productivos o con mucho trafico.

Este proyecto no incluye tests de carga porque el objetivo de la evaluacion es CI/CD, no performance.

#### Test de seguridad

Un test de seguridad busca vulnerabilidades o malas configuraciones.

Ejemplo:

```text
Revisar dependencias vulnerables o probar entradas maliciosas.
```

Caracteristicas:

- Puede incluir auditoria de dependencias.
- Puede probar headers, autenticacion, permisos o inyecciones.
- Es importante en sistemas reales.

En nuestro proyecto hay una base simple de seguridad al usar `npm audit` durante validaciones manuales, pero no se implemento un suite avanzado de seguridad porque esta fuera del alcance principal.

### Resumen de tipos de test y relacion con el proyecto

| Tipo de test | En que consiste | Esta en el proyecto? |
| --- | --- | --- |
| Unitario | Prueba una funcion aislada | No como foco principal |
| Integracion | Prueba varias partes juntas | Si, con Express + rutas + respuestas |
| Funcional | Verifica comportamiento esperado | Si |
| API | Prueba endpoints HTTP | Si, es el foco principal |
| Smoke test | Verifica rapidamente que lo esencial responde | Si, con `/health` y Docker |
| Contrato | Verifica acuerdo API/documentacion | Si, con OpenAPI |
| E2E | Prueba flujo completo en navegador | No |
| Regresion | Evita romper algo que ya funcionaba | Si, cada test cumple ese rol |
| Carga | Mide rendimiento bajo demanda | No |
| Seguridad | Busca vulnerabilidades | Basico/manual, no suite completa |

### Por que no son tests unitarios puros

Un test unitario puro prueba una funcion aislada, sin depender del framework HTTP ni de rutas reales.

Ejemplo de test unitario puro:

```text
sumar(2, 2) debe devolver 4
```

En este proyecto los tests importan la app Express completa y hacen peticiones HTTP simuladas. Por eso no son unitarios puros.

### Por que son tests de integracion livianos

Son de integracion porque prueban varias partes juntas:

- Express;
- rutas;
- respuestas HTTP;
- JSON devuelto;
- HTML devuelto;
- contrato OpenAPI;
- manejo de errores.

Pero son livianos porque no levantan una base de datos, no abren navegador real y no dependen de servicios externos.

### Por que no son end-to-end completos

Un test end-to-end completo simula el recorrido real de un usuario, normalmente con un navegador como Chrome.

Este proyecto no usa Playwright, Cypress ni navegador. Por eso no son E2E completos.

Sin embargo, si prueban el comportamiento externo de la API, que es lo mas importante para este tipo de backend.

---

## 10. Como funcionan tecnicamente los tests

Los tests usan tres herramientas:

```js
const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const request = require('supertest');
```

### node:test

`node:test` es el test runner nativo de Node.js.

Permite definir grupos y casos:

```js
describe('API Tests', () => {
  test('GET /health returns healthy', async () => {
    // test
  });
});
```

Ventaja:

- no requiere Jest;
- viene integrado con Node;
- es rapido;
- tiene menos dependencias;
- es suficiente para una API chica.

### node:assert/strict

`assert` se usa para verificar condiciones.

Ejemplo:

```js
assert.equal(res.statusCode, 200);
assert.equal(res.body.status, 'healthy');
```

Si una asercion falla, el test falla.

### Supertest

Supertest permite hacer peticiones HTTP contra la app Express sin levantar manualmente el servidor.

Ejemplo:

```js
const res = await request(app).get('/health');
```

La clave es que el test importa:

```js
const app = require('../src/app');
```

`src/app.js` exporta la app Express, pero no ejecuta `app.listen`. Eso permite probarla en memoria.

Esto evita problemas como:

- puerto ocupado;
- servidor que queda corriendo;
- tests lentos;
- dependencia de `localhost`.

---

## 11. Tests actuales uno por uno

Actualmente hay 5 tests.

### Test 1: `GET /`

Objetivo:

Verificar que la API principal responda correctamente.

Valida:

- status HTTP `200`;
- header `content-type` JSON;
- campo `status` igual a `ok`;
- campo `message` igual a `CI/CD Demo API`;
- campo `version` igual a la version del contrato OpenAPI.

Importancia:

Este test comprueba que la API base esta disponible y que la version del codigo coincide con la version del contrato.

### Test 2: `GET /health`

Objetivo:

Verificar que el health check este funcionando.

Valida:

- status HTTP `200`;
- respuesta JSON;
- campo `status` igual a `healthy`;
- campo `uptime` de tipo numerico.

Importancia:

El health check es usado para demostrar disponibilidad. Tambien sirve para smoke tests en Docker y para probar el deploy.

Frase para exposicion:

> "Si `/health` responde correctamente, puedo demostrar que el servicio esta vivo."

### Test 3: `GET /home`

Objetivo:

Verificar que la pagina visual de demostracion exista.

Valida:

- status HTTP `200`;
- header `content-type` HTML;
- texto `CI/CD Pipeline Demo`;
- texto `OpenAPI`;
- texto `Vercel`.

Importancia:

No es una prueba visual completa, pero asegura que la pantalla que se muestra en la exposicion no desaparezca ni quede desactualizada.

### Test 4: `GET /openapi.json`

Objetivo:

Verificar que la API publique su contrato OpenAPI.

Valida:

- status HTTP `200`;
- version OpenAPI `3.0.3`;
- existencia de la ruta `/`;
- existencia de la ruta `/health`;
- existencia de la ruta `/home`.

Importancia:

Este test conecta el codigo con la especificacion. No solo se prueba que la API responda, sino que tambien publique documentacion tecnica consumible.

### Test 5: ruta inexistente

Endpoint probado:

```text
GET /missing-route
```

Objetivo:

Verificar que la API maneje errores de forma controlada.

Valida:

- status HTTP `404`;
- respuesta JSON;
- campo `status` igual a `not_found`;
- mensaje que incluye la ruta solicitada.

Importancia:

Esto mejora la calidad de la API. En vez de devolver una respuesta generica o HTML de error, devuelve JSON consistente.

---

## 12. Que cubren los tests

Los tests cubren:

- endpoints principales;
- health check;
- pagina visual de demo;
- contrato OpenAPI publicado;
- error 404 controlado;
- codigos HTTP;
- headers `content-type`;
- campos JSON importantes;
- coherencia entre API y contrato.

---

## 13. Que no cubren los tests

Los tests no cubren:

- pruebas visuales pixel a pixel;
- interaccion real de navegador;
- pruebas de carga;
- pruebas de seguridad avanzadas;
- validacion completa de todos los schemas OpenAPI;
- autenticacion, porque el proyecto no tiene login.

Esto esta bien para el alcance del proyecto. La meta no es cubrir todo, sino demostrar una estrategia real de testing automatizado dentro del pipeline.

Frase para exposicion:

> "Los tests estan elegidos para cubrir lo critico del flujo CI/CD: disponibilidad, contrato, respuesta HTTP y manejo de errores."

---

## 14. Resultado esperado de tests

Al ejecutar:

```bash
npm test
```

Se espera:

```text
tests 5
pass 5
fail 0
```

Interpretacion:

- `tests 5`: se ejecutaron cinco casos.
- `pass 5`: los cinco pasaron.
- `fail 0`: no hubo fallos.

Si un test falla, `npm test` devuelve codigo de error. En CI eso detiene el pipeline.

---

## 15. Validacion OpenAPI

Ademas de tests, el proyecto tiene un validador del contrato.

Archivo:

```text
scripts/validate-openapi.js
```

Comando:

```bash
npm run validate:openapi
```

Este script valida que `docs/openapi.json` tenga:

- version `3.0.3`;
- `info.title`;
- `info.version`;
- objeto `paths`;
- ruta `/`;
- ruta `/health`;
- ruta `/home`;
- ruta `/openapi.json`;
- schema `RootResponse`;
- schema `HealthResponse`.

Esto suma una practica de Spec Driven Development, porque el contrato no queda como un archivo decorativo: tambien es validado por el pipeline.

---

## 16. Build local

El build local esta definido asi:

```json
"build": "npm run lint && npm run validate:openapi && npm test"
```

Eso significa que el build no compila una app frontend. En este backend, el build funciona como una compuerta de calidad.

Orden:

1. ESLint.
2. Validacion OpenAPI.
3. Tests automatizados.

Si cualquiera falla, el build falla.

---

## 17. Docker

Docker se usa para demostrar que la app puede empaquetarse y ejecutarse de forma reproducible.

El `Dockerfile` tiene dos etapas:

1. `builder`.
2. `production`.

La etapa `builder` ejecuta:

```bash
npm run build
```

Eso significa que Docker tambien valida lint, OpenAPI y tests.

Docker Compose agrega un healthcheck contra:

```text
http://localhost:3000/health
```

Esto demuestra que el contenedor no solo se construye, sino que responde.

---

## 18. GitHub Actions

El workflow esta en:

```text
.github/workflows/ci.yml
```

Corre en:

- push a `main`;
- pull request hacia `main`.

Jobs:

### quality

Valida:

- dependencias;
- lint;
- OpenAPI;
- tests;
- build;
- artefacto del contrato.

### docker

Valida:

- build de imagen;
- smoke test HTTP contra `/health`;
- export de imagen como artefacto.

### deploy

Despliega a Vercel si:

- el evento es push;
- la rama es `main`;
- existen los secrets de Vercel.

---

## 19. Vercel

Vercel despliega el proyecto como una funcion serverless.

Archivo clave:

```text
api/index.js
```

Ese archivo exporta la app Express:

```js
const app = require('../src/app');
module.exports = app;
```

Configuracion:

```text
vercel.json
```

Incluye:

- `installCommand`: `npm ci`;
- `buildCommand`: `npm run build`;
- `outputDirectory`: `public`;
- rewrite hacia `/api/index.js`.

---

## 20. Secretos de Vercel

Para deploy desde GitHub Actions se necesitan:

| Secret | Uso |
| --- | --- |
| `VERCEL_TOKEN` | Autoriza deploy desde CI. |
| `VERCEL_ORG_ID` | Identifica la cuenta o equipo. |
| `VERCEL_PROJECT_ID` | Identifica el proyecto. |

No se guardan credenciales en el repositorio.

---

## 21. Guion breve para exposicion

### Inicio

> "Este proyecto demuestra un flujo CI/CD completo sobre una API Express. Cada cambio subido a GitHub pasa por analisis, validacion de contrato, tests, build, Docker y deploy a Vercel."

### Mostrar arquitectura

> "El flujo empieza con el desarrollador, sigue en GitHub, pasa por GitHub Actions, ejecuta controles automaticos, genera artefactos y termina en Vercel."

### Mostrar app

Abrir:

```text
/home
```

> "Esta pantalla muestra visualmente las etapas del pipeline y enlaces para validar la API."

### Mostrar tests

Abrir:

```text
__tests__/app.test.js
```

> "Los tests son de API e integracion liviana. No prueban funciones aisladas, sino endpoints reales de Express usando Supertest."

### Ejecutar tests

```bash
npm test
```

> "Aca vemos cinco tests: raiz, health check, pagina HTML, contrato OpenAPI y error 404."

### Mostrar build

```bash
npm run build
```

> "El build local corre lint, valida OpenAPI y ejecuta tests. Si algo falla, el pipeline se detiene."

### Mostrar workflow

Abrir:

```text
.github/workflows/ci.yml
```

> "El pipeline tiene jobs encadenados: quality, docker y deploy. Deploy solo corre si lo anterior paso."

### Mostrar Vercel

Abrir la URL publicada.

Probar:

```text
/health
/openapi.json
```

> "El resultado final queda disponible en Vercel y se puede validar con endpoints publicos."

---

## 22. Preguntas que pueden hacer

### Que tipo de tests son?

Son tests automatizados de API, tambien llamados tests de integracion livianos o tests funcionales de endpoints.

### Por que no usaste Jest?

Porque Node.js ya trae `node:test`, que alcanza para este proyecto. Reduce dependencias y hace el pipeline mas simple.

### Por que usaste Supertest?

Porque permite probar endpoints Express sin levantar manualmente un servidor en un puerto.

### Por que probar `/home` si es HTML?

Porque es la pantalla que se muestra en la demo. El test asegura que exista y que contenga textos clave.

### Por que probar 404?

Porque una API tambien debe responder bien ante errores. El 404 JSON controlado es mas consistente que una respuesta generica.

### Que pasa si falla un test?

Falla `npm test`, falla el job de GitHub Actions y no se ejecuta el deploy.

### Por que Docker si Vercel no usa esa imagen?

Porque Docker demuestra reproducibilidad y valida que el proyecto puede ejecutarse en un entorno aislado. Es una exigencia comun en CI/CD.

### Para que sirve OpenAPI?

Sirve como contrato de la API. Documenta rutas y respuestas esperadas. En este proyecto tambien se valida automaticamente.

---

## 23. Comandos para practicar antes de exponer

```bash
npm ci
npm run lint
npm run validate:openapi
npm test
npm run build
docker build -t ci-cd-demo:local .
docker compose up --build
```

Probar:

```text
http://localhost:3000/home
http://localhost:3000/health
http://localhost:3000/openapi.json
```

Bajar Compose:

```bash
docker compose down
```

En Windows:

```bash
npm.cmd ci
npm.cmd run lint
npm.cmd run validate:openapi
npm.cmd test
npm.cmd run build
```

---

## 24. Cierre recomendado

> "El valor del proyecto no esta en que la API sea grande, sino en que el proceso es profesional: cada cambio se valida automaticamente, se prueba, se empaqueta, genera artefactos y se despliega en Vercel. Eso es justamente lo que busca CI/CD: reducir errores manuales y aumentar confianza en cada entrega."
