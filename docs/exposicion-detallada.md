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
2. Validacion de sintaxis JavaScript y JSON.
3. Analisis estatico del codigo.
4. Validacion del contrato OpenAPI.
5. Ejecucion de tests automatizados.
6. Build local.
7. Construccion de imagen Docker.
8. Smoke test del contenedor.
9. Generacion de artefactos.
10. Despliegue en Vercel.

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
4. Valida sintaxis JavaScript y JSON.
5. Ejecuta ESLint.
6. Valida OpenAPI.
7. Ejecuta tests.
8. Ejecuta build local.
9. Publica el contrato OpenAPI como artefacto.

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
6. Si el deploy fue exitoso y la API key de CallMeBot esta configurada, envia un WhatsApp con el mensaje `todo funciona`.

Frase para exposicion:

> "El despliegue no se hace manualmente desde mi computadora. Lo hace el pipeline despues de validar el codigo."

Condicion importante:

```text
success() && push a main
```

Esto significa que Vercel solo recibe un deploy si todos los controles anteriores pasaron correctamente. Si falla un test, falla el job `quality`; si falla `quality`, no corre Docker; y si Docker no corre correctamente, tampoco se ejecuta el deploy.

Frase para exposicion:

> "Un test fallido corta la cadena completa: no hay imagen Docker valida y no hay despliegue a produccion."

Tambien se agrego feedback por WhatsApp usando CallMeBot. Este feedback no reemplaza a los logs de GitHub Actions ni al estado de Vercel, pero sirve como aviso rapido cuando la entrega termino correctamente.

---

## 8. Validacion de sintaxis

Ademas de tests funcionales, el proyecto tiene una validacion explicita de sintaxis:

```bash
npm run validate:syntax
```

Esta validacion usa dos mecanismos:

1. `node --check` para archivos JavaScript.
2. `JSON.parse` para archivos JSON.

Que revisa:

- `src/app.js`;
- `src/index.js`;
- `api/index.js`;
- scripts de validacion;
- tests;
- `package.json`;
- `vercel.json`;
- `docs/openapi.json`.

No ejecuta la aplicacion ni hace requests HTTP. Su objetivo es detectar errores de escritura, llaves mal cerradas, JSON invalido o JavaScript que Node no pueda interpretar.

Frase para exposicion:

> "Antes de analizar estilo o correr pruebas, el pipeline verifica que los archivos principales sean sintacticamente validos."

### Es un test de sintaxis?

En sentido estricto, `validate:syntax` no es un test funcional como los de `__tests__/app.test.js`, porque no usa `node:test`, no hace peticiones HTTP y no valida comportamiento de la API.

Es una validacion automatizada de sintaxis. Dentro de un pipeline CI/CD cumple un rol parecido al de una prueba temprana: si el codigo no puede ser interpretado por Node o si un JSON esta mal escrito, el proceso falla inmediatamente.

Se puede explicar asi:

> "No prueba comportamiento, prueba que el codigo y la configuracion esten bien escritos a nivel sintactico."

### Por que es util en CI/CD

Esta validacion sirve para detectar errores muy basicos antes de gastar tiempo en pasos mas pesados.

Ejemplos de errores que detecta:

- una llave `}` faltante en JavaScript;
- un parentesis mal cerrado;
- un `package.json` con coma de mas;
- un `vercel.json` invalido;
- un `openapi.json` que no se puede parsear;
- un archivo de test con sintaxis rota.

Si alguno de esos errores existe, no tiene sentido seguir con lint, OpenAPI, tests, Docker o deploy. Por eso esta validacion corre al principio del build.

### Codigo del validador de sintaxis explicado

Archivo:

```text
scripts/validate-syntax.js
```

Codigo:

```js
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
```

Explicacion:

- `spawnSync`: permite ejecutar comandos del sistema desde Node. En este caso se usa para correr `node --check`.
- `fs`: permite leer archivos del disco. Se usa para abrir archivos JSON.
- `path`: permite construir rutas compatibles con Windows, Linux y macOS.

```js
const root = path.join(__dirname, '..');
```

Explicacion:

- `__dirname` apunta a la carpeta donde esta el script, o sea `scripts`.
- `..` sube un nivel hasta la raiz del proyecto.
- `root` queda apuntando al directorio principal del repo.

Esto evita depender de rutas hardcodeadas y hace que el script funcione igual en local y en GitHub Actions.

```js
const jsFiles = [
  'api/index.js',
  'eslint.config.js',
  'scripts/validate-openapi.js',
  'scripts/validate-syntax.js',
  'src/app.js',
  'src/index.js',
  '__tests__/app.test.js'
];
```

Explicacion:

Esta lista contiene los archivos JavaScript principales del proyecto:

- adaptador de Vercel;
- configuracion de ESLint;
- scripts de validacion;
- aplicacion Express;
- entrada local;
- tests automatizados.

Cada archivo de esta lista se revisa con `node --check`.

```js
const jsonFiles = [
  'docs/openapi.json',
  'package.json',
  'vercel.json'
];
```

Explicacion:

Esta lista contiene archivos JSON importantes:

- `docs/openapi.json`: contrato de la API;
- `package.json`: scripts, dependencias y metadata del proyecto;
- `vercel.json`: configuracion de deploy.

Si uno de estos JSON tiene sintaxis invalida, el pipeline debe fallar.

```js
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], {
    encoding: 'utf8'
  });
```

Explicacion:

- Recorre cada archivo JavaScript.
- `process.execPath` es la ruta del ejecutable de Node que esta corriendo el script.
- `--check` le dice a Node: "analiza la sintaxis, pero no ejecutes el archivo".
- `path.join(root, file)` arma la ruta completa del archivo.
- `encoding: 'utf8'` permite leer la salida como texto.

Ejemplo equivalente:

```bash
node --check src/app.js
```

Ese comando no levanta el servidor. Solo confirma que Node puede interpretar el archivo.

```js
  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    throw new Error(`JavaScript syntax check failed: ${file}`);
  }
}
```

Explicacion:

- `result.status` es el codigo de salida del comando.
- `0` significa exito.
- Cualquier valor distinto de `0` significa error.
- Si hay error, se imprime el mensaje en consola y se lanza una excepcion.

Esa excepcion hace que el comando falle. En GitHub Actions, un comando fallido corta el job.

```js
for (const file of jsonFiles) {
  const fullPath = path.join(root, file);
  JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}
```

Explicacion:

- Recorre cada archivo JSON.
- Lee el contenido con `fs.readFileSync`.
- Intenta convertirlo en objeto con `JSON.parse`.

Si el JSON esta mal escrito, `JSON.parse` lanza un error y el pipeline falla.

Ejemplo de JSON invalido:

```json
{
  "name": "ci-cd-demo",
}
```

Esa coma final haria fallar la validacion.

```js
console.log('JavaScript and JSON syntax are valid.');
```

Explicacion:

Si el script llega a esta linea, significa que todos los JS pasaron `node --check` y todos los JSON pasaron `JSON.parse`.

Mensaje esperado:

```text
JavaScript and JSON syntax are valid.
```

### Donde se ejecuta la validacion de sintaxis

Se ejecuta en tres lugares:

1. Manualmente, con:

```bash
npm run validate:syntax
```

2. Dentro del build local:

```bash
npm run build
```

Porque el build incluye:

```bash
npm run validate:syntax && npm run lint && npm run validate:openapi && npm test
```

3. En GitHub Actions, antes de ESLint:

```yaml
- name: Validate JavaScript and JSON syntax
  run: npm run validate:syntax
```

Esto significa que un error de sintaxis bloquea todo lo siguiente.

### Diferencia entre sintaxis, lint y tests

| Control | Que revisa | Ejemplo de error |
| --- | --- | --- |
| Sintaxis | Que JS/JSON esten bien escritos | Llave faltante, JSON invalido |
| Lint | Reglas de calidad de codigo | Variable sin usar |
| OpenAPI | Estructura minima del contrato | Falta `/health` |
| Tests | Comportamiento real de la API | `/health` no responde `healthy` |

Frase para exposicion:

> "La validacion de sintaxis responde a la pregunta: el proyecto se puede leer? El lint responde: el codigo respeta reglas de calidad? Los tests responden: la API se comporta como esperamos?"

---

## 9. Explicacion profunda de los tests

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

## 10. Que tipo de tests son

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

## 11. Como funcionan tecnicamente los tests

Los tests usan tres herramientas:

```js
const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const request = require('supertest');
```

Tambien importan dos archivos del proyecto:

```js
const app = require('../src/app');
const openApiSpec = require('../docs/openapi.json');
```

`app` es la aplicacion Express que se va a probar. `openApiSpec` es el contrato OpenAPI, usado para comparar datos del test con la especificacion real.

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

### Estructura general del archivo de tests

El archivo completo esta organizado asi:

```js
describe('API Tests', () => {
  test('...', async () => {
    // request
    // asserts
  });
});
```

`describe` agrupa todos los tests relacionados con la API.

`test` define un caso concreto. Cada caso tiene:

1. una descripcion legible;
2. una request con Supertest;
3. varias aserciones con `assert`.

La palabra `async` permite usar `await` para esperar la respuesta HTTP simulada.

### Imports explicados linea por linea

```js
const assert = require('node:assert/strict');
```

Importa el modulo de aserciones estricto de Node. Sirve para comparar resultados esperados contra resultados reales.

```js
const { describe, test } = require('node:test');
```

Importa las funciones del test runner nativo:

- `describe`: agrupa tests.
- `test`: define un caso de prueba.

```js
const request = require('supertest');
```

Importa Supertest. Se usa para enviar requests a Express sin levantar un servidor real.

```js
const app = require('../src/app');
```

Importa la app Express. Esta app tiene las rutas `/`, `/health`, `/home`, `/openapi.json` y el 404 controlado.

```js
const openApiSpec = require('../docs/openapi.json');
```

Importa el contrato OpenAPI como objeto JavaScript. Se usa, por ejemplo, para verificar que la version que responde `/` coincida con la version documentada.

### Primer test explicado: `GET /`

Codigo:

```js
test('GET / returns correct response', async () => {
  const res = await request(app).get('/');
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.message, 'CI/CD Demo API');
  assert.equal(res.body.version, openApiSpec.info.version);
});
```

Explicacion:

- `request(app).get('/')`: simula una peticion HTTP GET a la raiz.
- `await`: espera la respuesta.
- `res.statusCode`: codigo HTTP recibido.
- `assert.equal(res.statusCode, 200)`: exige que la API responda correctamente.
- `assert.match(..., /application\/json/)`: verifica que la respuesta sea JSON.
- `res.body.status`: lee el campo `status` del JSON.
- `res.body.message`: lee el mensaje de la API.
- `res.body.version`: lee la version expuesta por la API.
- `openApiSpec.info.version`: toma la version desde el contrato OpenAPI.

Este test comprueba que la API principal este viva y alineada con su contrato.

### Segundo test explicado: `GET /health`

Codigo:

```js
test('GET /health returns healthy', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.equal(res.body.status, 'healthy');
  assert.equal(typeof res.body.uptime, 'number');
});
```

Explicacion:

- Hace una peticion a `/health`.
- Verifica HTTP `200`.
- Verifica que la respuesta sea JSON.
- Verifica `status: healthy`.
- Verifica que `uptime` sea un numero.

Este test funciona como smoke test de la API. No prueba todo el sistema, pero confirma que el servicio responde y esta vivo.

### Tercer test explicado: `GET /home`

Codigo:

```js
test('GET /home returns the demo HTML page', async () => {
  const res = await request(app).get('/home');
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'], /text\/html/);
  assert.match(res.text, /CI\/CD Pipeline Demo/);
  assert.match(res.text, /OpenAPI/);
  assert.match(res.text, /Vercel/);
});
```

Explicacion:

- Hace una peticion a `/home`.
- Verifica que responda `200`.
- Verifica que el contenido sea HTML.
- `res.text` contiene el HTML como texto.
- Busca textos clave dentro de la pagina.

Este test evita que la pagina de exposicion se rompa o pierda contenido importante.

No es un test visual de navegador, porque no renderiza la pagina como lo haria Chrome, pero valida que el endpoint HTML exista y entregue contenido correcto.

### Cuarto test explicado: `GET /openapi.json`

Codigo:

```js
test('GET /openapi.json exposes the API contract used by the app', async () => {
  const res = await request(app).get('/openapi.json');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.openapi, '3.0.3');
  assert.ok(res.body.paths['/']);
  assert.ok(res.body.paths['/health']);
  assert.ok(res.body.paths['/home']);
});
```

Explicacion:

- Pide el contrato publicado por la API.
- Verifica codigo `200`.
- Verifica version OpenAPI `3.0.3`.
- `assert.ok(...)` comprueba que existan rutas dentro del contrato.

Este test se relaciona con Spec Driven Development porque valida que la API publique su especificacion.

### Quinto test explicado: ruta inexistente

Codigo:

```js
test('GET unknown route returns a JSON 404 response', async () => {
  const res = await request(app).get('/missing-route');
  assert.equal(res.statusCode, 404);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.equal(res.body.status, 'not_found');
  assert.match(res.body.message, /missing-route/);
});
```

Explicacion:

- Pide una ruta que no existe.
- Verifica que el servidor responda `404`.
- Verifica que el error sea JSON.
- Verifica `status: not_found`.
- Verifica que el mensaje mencione la ruta solicitada.

Este test comprueba que los errores tambien estan controlados. En una API, no solo importan las respuestas exitosas: tambien importa que los errores sean claros y consistentes.

### Que pasa si una asercion falla

Ejemplo:

```js
assert.equal(res.statusCode, 200);
```

Si la API devuelve `500` en vez de `200`, esa linea falla.

Consecuencia:

1. Falla el test.
2. Falla `npm test`.
3. Falla el job `quality` de GitHub Actions.
4. No corre Docker.
5. No corre deploy a Vercel.

Esto es una parte clave del CI/CD: un error detectado por tests impide que el codigo llegue a produccion.

---

## 12. Tests actuales uno por uno

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

## 13. Que cubren los tests

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

## 14. Que no cubren los tests

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

## 15. Resultado esperado de tests

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

En este proyecto esa falla tambien evita el despliegue. El flujo esta encadenado asi:

```text
quality -> docker -> deploy
```

Por eso:

1. Si falla `npm test`, falla `quality`.
2. Si falla `quality`, no corre el job `docker`.
3. Si no corre o falla `docker`, no corre `deploy`.

Ademas, el job de deploy tiene `success()` como condicion explicita. Eso refuerza que solo se despliega cuando todo lo anterior termino correctamente.

---

## 16. Validacion OpenAPI

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

## 17. Build local

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

## 18. Docker

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

## 19. GitHub Actions

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

Despues del deploy, puede enviar una notificacion por WhatsApp usando CallMeBot. Para evitar falsos positivos, el mensaje se manda solo si el paso de Vercel termino correctamente.

---

## 20. Vercel

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

## 21. Secretos de Vercel

Para deploy desde GitHub Actions se necesitan:

| Secret | Uso |
| --- | --- |
| `VERCEL_TOKEN` | Autoriza deploy desde CI. |
| `VERCEL_ORG_ID` | Identifica la cuenta o equipo. |
| `VERCEL_PROJECT_ID` | Identifica el proyecto. |
| `CALLMEBOT_APIKEY` | API key de CallMeBot para enviar WhatsApp. |
| `WHATSAPP_TO` | Numero que recibe el mensaje `todo funciona`. Si no se configura, usa `+5493482299620`. |

No se guardan credenciales en el repositorio.

---

## 22. Guion breve para exposicion

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

## 23. Preguntas que pueden hacer

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

Falla `npm test`, falla el job `quality`, no se ejecuta Docker y no se ejecuta el deploy a Vercel. El codigo roto no llega a produccion.

### Por que Docker si Vercel no usa esa imagen?

Porque Docker demuestra reproducibilidad y valida que el proyecto puede ejecutarse en un entorno aislado. Es una exigencia comun en CI/CD.

### Para que sirve OpenAPI?

Sirve como contrato de la API. Documenta rutas y respuestas esperadas. En este proyecto tambien se valida automaticamente.

---

## 24. Comandos para practicar antes de exponer

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

## 25. Cierre recomendado

> "El valor del proyecto no esta en que la API sea grande, sino en que el proceso es profesional: cada cambio se valida automaticamente, se prueba, se empaqueta, genera artefactos y se despliega en Vercel. Eso es justamente lo que busca CI/CD: reducir errores manuales y aumentar confianza en cada entrega."
