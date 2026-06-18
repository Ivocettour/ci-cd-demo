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

## 2. Base teorica tomada del apunte

El apunte de Ingenieria y Calidad ayuda a explicar que este proyecto no es solamente "una API subida a internet". Lo importante es mostrar un proceso de ingenieria de software: controlado, repetible, verificable y con feedback rapido.

### Ingenieria de software aplicada

La ingenieria de software busca construir software de forma sistematica y mantenible. En este proyecto eso se ve en decisiones concretas:

- el codigo esta versionado en GitHub;
- las dependencias se instalan de manera reproducible con `npm ci`;
- la ejecucion local esta documentada;
- el contrato OpenAPI esta guardado en el repositorio;
- los tests se ejecutan siempre igual en local y CI;
- el deploy no depende de pasos manuales desde una computadora personal.

Frase para exposicion:

> "No solo entregamos una aplicacion funcionando; entregamos un proceso para poder cambiarla, probarla y desplegarla con control."

### Control de cambios y control de versiones

El apunte remarca que el control de versiones permite registrar que cambio se hizo, quien lo hizo, cuando se hizo y por que. En nuestro proyecto eso esta representado por Git y GitHub.

GitHub cumple varios roles:

- guarda el historial de commits;
- permite trabajar con ramas;
- dispara el pipeline cuando hay un push o pull request;
- conserva evidencia de cada ejecucion de CI/CD;
- permite volver a una version anterior si algo sale mal.

La estrategia elegida para este proyecto es simple:

- `main` representa la rama estable y desplegable;
- los cambios se pueden trabajar en ramas separadas;
- un pull request permite revisar antes de integrar;
- el pipeline corre tanto en pull request como en push a `main`;
- el despliegue productivo solo queda habilitado para `main`.

Esto se relaciona con la idea del apunte de trabajar con cambios pequenos. Cuanto mas chico es el cambio, mas facil es integrarlo, probarlo y corregirlo.

Frase para exposicion:

> "GitHub no se usa solo como almacenamiento: funciona como punto de control del cambio y como disparador del proceso de integracion."

### Integracion Continua como practica

El apunte plantea la Integracion Continua como una practica de desarrollo, no solamente como una herramienta. La idea es integrar cambios frecuentemente y verificar cada integracion mediante una build automatizada con pruebas.

En nuestro proyecto, esa idea se implementa con GitHub Actions:

```text
push o pull request -> GitHub Actions -> quality -> docker
push a main aprobado -> deploy a Vercel
```

La integracion continua se demuestra porque cada cambio pasa por controles automaticos. El despliegue queda reservado para los push a `main` que ya pasaron esos controles.

- instalacion limpia;
- validacion de sintaxis;
- analisis estatico;
- validacion del contrato;
- tests automatizados;
- build local;
- generacion de artefacto.

El objetivo no es "tener un YAML", sino detectar errores lo antes posible. Si un error aparece en CI, se corrige antes de que llegue a produccion.

Frase para exposicion:

> "CI no es GitHub Actions por si solo; CI es la disciplina de integrar cambios pequenos y verificarlos automaticamente."

### Pipeline y build

El apunte diferencia pipeline y build. El pipeline es el conjunto completo de etapas por las que pasa el software. La build es una parte de ese pipeline.

En este proyecto, el pipeline completo es:

```text
Repositorio -> CI -> sintaxis -> lint -> OpenAPI -> tests -> build -> Docker -> Vercel -> feedback
```

La build local se ejecuta con:

```bash
npm run build
```

En una aplicacion frontend, una build suele generar archivos estaticos. En nuestro backend Express, la build funciona como una compuerta de calidad:

```text
validate:syntax + lint + validate:openapi + test
```

Por eso, cuando decimos "build", no queremos decir solamente compilar. Queremos decir: "dejar evidencia de que el proyecto puede validarse de manera automatica".

Frase para exposicion:

> "En este proyecto la build es una barrera de calidad: si algo basico esta roto, no se construye Docker y no se despliega."

### Feedback rapido

El apunte destaca que uno de los objetivos principales de CI es generar retroalimentacion rapida. El equipo tiene que saber cuanto antes si la ultima integracion funciono o fallo.

En nuestro proyecto hay tres niveles de feedback:

| Nivel | Herramienta | Que informa |
| --- | --- | --- |
| CI | GitHub Actions | Si pasaron sintaxis, lint, OpenAPI, tests, build y Docker. |
| Entrega | Vercel | Si el deploy quedo `Ready` o fallo. |
| Aviso rapido | CallMeBot WhatsApp | Si el deploy productivo termino correctamente. |

El mensaje de WhatsApp dice:

```text
todo funciona
```

Ese aviso no reemplaza al pipeline ni a los logs, pero muestra un mecanismo de feedback automatico, que es una parte importante de CI/CD.

Frase para exposicion:

> "El feedback no queda escondido en mi computadora: GitHub, Vercel y WhatsApp avisan el estado del proceso."

### Entrega Continua y Despliegue Continuo

El apunte diferencia Entrega Continua y Despliegue Continuo.

Entrega Continua significa que el software queda siempre en un estado listo para ser desplegado. Despliegue Continuo significa que, ademas, cada cambio aprobado llega automaticamente a produccion.

En nuestro proyecto estamos muy cerca de Despliegue Continuo para `main`, porque:

- cada push a `main` dispara el pipeline;
- si pasan los controles, se ejecuta deploy a Vercel;
- si falla un test o validacion, no se despliega;
- el entorno productivo queda publicado en Vercel.

Tambien se puede explicar como Entrega Continua porque el proyecto queda preparado para entregar una version confiable en cualquier momento.

Frase para exposicion:

> "No subimos manualmente una carpeta a produccion. El despliegue queda automatizado y condicionado por la calidad del pipeline."

### Verificacion y validacion

En calidad de software se suele distinguir entre verificacion y validacion:

- Verificacion: comprobar que el producto se esta construyendo correctamente.
- Validacion: comprobar que el producto cumple su proposito y resulta util.

En nuestro proyecto:

| Concepto | Ejemplo en el proyecto |
| --- | --- |
| Verificacion | `validate:syntax`, ESLint, OpenAPI, tests automatizados, build Docker. |
| Validacion | Probar `/health`, abrir `/home`, revisar la API desplegada en Vercel. |

La verificacion mira mas el proceso tecnico. La validacion mira si lo que entregamos sirve para el objetivo: demostrar una API funcionando con CI/CD.

Frase para exposicion:

> "Verificamos que el codigo este bien construido y validamos que la API realmente responda como se espera."

### Calidad como proceso, producto y personas

El apunte remarca que la calidad no es solamente testing. En este proyecto se puede defender desde tres dimensiones:

| Dimension | Como aparece en el proyecto |
| --- | --- |
| Calidad del proceso | Pipeline automatico, comandos documentados, Docker, deploy controlado. |
| Calidad del producto | API con endpoints claros, contrato OpenAPI, errores JSON consistentes. |
| Calidad de las personas/equipo | README, guia completa, exposicion, estrategia de ramas y feedback. |

Los tests son importantes, pero no son toda la calidad. Tambien importan la reproducibilidad, la documentacion, el control de versiones, la automatizacion y la capacidad de corregir rapido.

Frase para exposicion:

> "Testing confirma parte de la calidad, pero la calidad se construye en todo el proceso: desde el commit hasta el deploy."

---

## 3. Stack tecnologico

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

## 4. Estructura importante del repositorio

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

## 5. Funcionamiento de la API

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

## 6. Explicacion de la pagina visual

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

## 7. Que es CI en este proyecto

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

## 8. Que es CD en este proyecto

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

## 9. Validacion de sintaxis

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

## 10. Explicacion profunda de los tests

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

## 11. Que tipo de tests son

Los tests del proyecto son principalmente tests automatizados de API e integracion liviana. Se llaman asi porque hacen requests HTTP contra la aplicacion Express y verifican codigos de estado, headers y cuerpos de respuesta.

Tambien son tests funcionales porque validan comportamiento observable: que la API responda lo que se espera ante una peticion concreta.

La clasificacion especifica de cada caso se explica test por test en la seccion "Tests actuales uno por uno". Eso es mas claro para la exposicion porque permite decir no solo "que tipo de test usamos", sino tambien por que cada test pertenece a ese tipo.

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

## 12. Como funcionan tecnicamente los tests

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

## 13. Tests actuales uno por uno

Actualmente hay 5 tests.

### Test 1: `GET /`

Tipo de test:

- Test de API.
- Test funcional.
- Test de integracion liviana.
- Test de regresion.

Por que:

- Es de API porque hace una peticion HTTP `GET /` y valida la respuesta.
- Es funcional porque comprueba el comportamiento esperado de la ruta principal.
- Es de integracion liviana porque prueba Express, la ruta y la respuesta JSON trabajando juntos, sin base de datos ni servicios externos.
- Es de regresion porque evita que un cambio futuro rompa la respuesta base de la API.

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

Tipo de test:

- Test de API.
- Test funcional.
- Smoke test.
- Test de integracion liviana.
- Test de regresion.

Por que:

- Es de API porque consulta el endpoint HTTP `/health`.
- Es funcional porque valida que el health check devuelva el estado esperado.
- Es smoke test porque confirma rapidamente que lo esencial del sistema esta vivo y responde.
- Es de integracion liviana porque prueba la app Express y su ruta real sin levantar un servidor externo.
- Es de regresion porque protege una ruta critica que tambien se usa para Docker y deploy.

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

Tipo de test:

- Test de API.
- Test funcional.
- Test de integracion liviana.
- Test de regresion.

Por que:

- Es de API porque hace una peticion HTTP a `/home`.
- Es funcional porque valida que la pagina de demostracion exista y entregue contenido esperado.
- Es de integracion liviana porque prueba Express, la ruta HTML y el contenido devuelto.
- Es de regresion porque evita que la pantalla usada en la exposicion desaparezca o pierda textos clave.

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

Tipo de test:

- Test de API.
- Test funcional.
- Test de contrato parcial.
- Test de integracion liviana.
- Test de regresion.

Por que:

- Es de API porque consulta el endpoint HTTP `/openapi.json`.
- Es funcional porque verifica que la API publique documentacion tecnica consumible.
- Es de contrato parcial porque comprueba que la especificacion OpenAPI exista, tenga version esperada e incluya rutas importantes.
- Es de integracion liviana porque conecta la app Express con el archivo de especificacion publicado.
- Es de regresion porque evita que un cambio futuro deje de exponer el contrato.

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

Tipo de test:

- Test de API.
- Test funcional negativo.
- Test de integracion liviana.
- Test de regresion.

Por que:

- Es de API porque hace una peticion HTTP a una ruta inexistente.
- Es funcional negativo porque no prueba el camino feliz, sino el comportamiento esperado ante un error.
- Es de integracion liviana porque valida el middleware/ruta de manejo de errores de Express y la respuesta JSON.
- Es de regresion porque evita que la API vuelva a responder errores inconsistentes o HTML generico.

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

## 14. Que cubren los tests

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

## 15. Estrategia de pruebas del proyecto

La estrategia de pruebas del proyecto esta pensada para una API pequena, sin base de datos y enfocada en demostrar CI/CD. Por eso se priorizan pruebas rapidas, automaticas y faciles de ejecutar en local, Docker y GitHub Actions.

La estrategia no intenta "tener todos los tipos de test posibles". Intenta cubrir lo mas importante para el riesgo real del proyecto. Como la aplicacion es una API Express simple, el mayor riesgo no esta en una formula matematica compleja, sino en que:

- una ruta deje de responder;
- el contrato OpenAPI quede desactualizado;
- el JSON de configuracion se rompa;
- el contenedor no arranque;
- se despliegue una version fallada.

Por eso la estrategia se basa en seis ideas:

1. Fallar temprano.
2. Probar comportamiento observable.
3. Validar el contrato de la API.
4. Usar smoke tests para confirmar disponibilidad.
5. Mantener pruebas rapidas y repetibles.
6. Bloquear el despliegue si algo importante falla.

Frase para exposicion:

> "No agregamos pruebas al azar. Elegimos pruebas alineadas con los riesgos reales de una API chica que debe integrarse y desplegarse automaticamente."

### 15.1 Fallar temprano

El pipeline ejecuta primero controles baratos y rapidos.

Orden:

```text
validate:syntax -> lint -> validate:openapi -> test -> build -> docker -> deploy
```

Esto significa que si hay un error simple, por ejemplo un JSON mal escrito, no se pierde tiempo ejecutando Docker o deploy.

Ejemplo:

- Si `vercel.json` tiene una coma de mas, falla `validate:syntax`.
- Si una variable esta mal usada, falla `lint`.
- Si falta `/health` en OpenAPI, falla `validate:openapi`.
- Si `/health` no responde `healthy`, falla `npm test`.

Frase para exposicion:

> "La estrategia busca detectar primero los errores mas baratos de encontrar y dejar para despues los pasos mas costosos."

Esto se conecta con la idea del apunte de detectar fallos cuanto antes. Un error encontrado antes del deploy es mas barato de corregir que un error encontrado por un usuario en produccion.

### 15.2 Probar desde afuera

Como el proyecto es una API, la estrategia no se centra en funciones internas aisladas. Se centra en probar la API como la consume un cliente.

Por eso usamos Supertest:

```js
const res = await request(app).get('/health');
```

Ese enfoque valida:

- rutas reales;
- codigos HTTP;
- headers;
- JSON;
- HTML;
- errores.

Esto da confianza porque se prueba el comportamiento observable, no solo detalles internos.

Esta decision tambien evita tests fragiles. Si manana se reordena internamente el codigo de `src/app.js`, los tests no deberian fallar mientras la API siga respondiendo igual. Eso es sano: el test protege el contrato externo, no una implementacion puntual.

### 15.3 Piramide de pruebas adaptada al proyecto

En un sistema grande suele hablarse de piramide de pruebas:

```text
Muchos tests unitarios
Menos tests de integracion
Pocos tests end-to-end
```

En este proyecto la piramide se adapta al alcance:

```text
Validaciones automaticas: sintaxis, lint, OpenAPI
Tests de API/integracion liviana: endpoints Express
Smoke tests: /health y Docker
Sin E2E de navegador porque no hay frontend complejo
```

No agregamos tests unitarios artificiales porque no hay logica de negocio compleja que lo justifique. Crear tests unitarios forzados solo para tenerlos haria el proyecto menos claro.

La piramide queda adaptada asi:

| Capa | Herramienta | Objetivo |
| --- | --- | --- |
| Sintaxis | `node --check` y `JSON.parse` | Confirmar que JS y JSON se pueden interpretar. |
| Calidad estatica | ESLint | Detectar problemas de estilo, malas practicas o variables mal usadas. |
| Contrato | `validate-openapi` y `/openapi.json` | Confirmar que la API documentada existe y se publica. |
| API/integracion | `node:test` + Supertest | Probar endpoints reales sin levantar servidor externo. |
| Smoke Docker | `docker compose` / health check | Confirmar que la imagen arranca y responde. |
| Deploy | Vercel condicionado por CI | Publicar solo si todo lo anterior paso. |

Esta estructura cubre desde errores muy simples hasta errores de empaquetado y entrega.

### 15.4 Criterios elegidos para testear

Se eligieron endpoints que representan partes importantes del sistema:

| Endpoint/control | Motivo |
| --- | --- |
| `/` | Verifica que la API base responde y coincide con la version del contrato. |
| `/health` | Sirve como smoke test y health check para Docker/deploy. |
| `/home` | Valida la pagina visual que se muestra en la exposicion. |
| `/openapi.json` | Verifica que el contrato este publicado. |
| `/missing-route` | Verifica manejo de errores 404 en JSON. |
| `validate:syntax` | Detecta JS o JSON invalido antes de ejecutar pasos caros. |
| `validate:openapi` | Evita que el contrato quede incompleto o roto. |

Cada prueba tiene una razon concreta:

- `/` demuestra que la API base esta disponible.
- `/health` sirve para monitoreo, Docker y smoke test.
- `/home` ayuda a la exposicion y verifica que la pagina visual no desaparezca.
- `/openapi.json` une codigo y especificacion.
- `/missing-route` valida que tambien los errores sean consistentes.

Esto es importante porque una API no solo debe responder bien cuando todo sale perfecto; tambien debe responder de forma controlada cuando el cliente pide algo incorrecto.

### 15.5 Que pasa cuando falla una prueba

La estrategia esta conectada al pipeline.

Si falla cualquier prueba o validacion:

```text
falla quality -> no corre docker -> no corre deploy
```

Ejemplo:

1. Se rompe `/health`.
2. Falla el test de `/health`.
3. Falla `npm test`.
4. Falla el job `quality`.
5. No se construye imagen Docker.
6. No se despliega en Vercel.

Esto es importante porque convierte los tests en una barrera real de calidad, no solo en una formalidad.

Este comportamiento es intencional. Si el pipeline permitiera desplegar aunque falle un test, los tests serian solo informativos. En este proyecto son una compuerta: para llegar a Vercel, el cambio primero tiene que demostrar que funciona.

Frase para exposicion:

> "Los tests no estan de adorno. Tienen poder de decision: si fallan, no hay deploy."

### 15.6 Por que esta estrategia es adecuada

Es adecuada porque:

- es rapida;
- no requiere servicios externos;
- se ejecuta igual en local y CI;
- cubre endpoints criticos;
- valida contrato y comportamiento;
- detecta errores de configuracion;
- confirma que Docker puede ejecutar la app;
- permite explicar claramente que se prueba;
- bloquea el despliegue si hay fallos.

Para una evaluacion de CI/CD, esta estrategia muestra lo esencial: automatizacion, repetibilidad, feedback rapido y proteccion antes de produccion.

Tambien muestra una idea clave de calidad: no se espera al final para probar. La calidad se incorpora al flujo completo:

```text
codigo -> sintaxis -> lint -> contrato -> tests -> build -> Docker -> deploy
```

Cada etapa aporta una evidencia distinta. Ninguna etapa por si sola garantiza todo, pero juntas reducen mucho el riesgo.

### 15.7 Posibles mejoras futuras

Si el proyecto creciera, se podria sumar:

- tests unitarios para logica de negocio real;
- tests E2E con Playwright si hubiera frontend interactivo;
- validacion completa de OpenAPI con una herramienta externa;
- tests de carga para medir rendimiento;
- tests de seguridad;
- coverage report.

No se agregan ahora para evitar complejidad innecesaria. La estrategia actual esta alineada con el tamano real del proyecto.

---

## 16. Que no cubren los tests

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

## 17. Resultado esperado de tests

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

## 18. Validacion OpenAPI

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

## 19. Build local

El build local esta definido asi:

```json
"build": "npm run validate:syntax && npm run lint && npm run validate:openapi && npm test"
```

Eso significa que el build no compila una app frontend. En este backend, el build funciona como una compuerta de calidad.

Orden:

1. Validacion de sintaxis JavaScript y JSON.
2. ESLint.
3. Validacion OpenAPI.
4. Tests automatizados.

Si cualquiera falla, el build falla.

---

## 20. Docker

Docker se usa para demostrar que la app puede empaquetarse y ejecutarse de forma reproducible.

El `Dockerfile` tiene dos etapas:

1. `builder`.
2. `production`.

La etapa `builder` ejecuta:

```bash
npm run build
```

Eso significa que Docker tambien valida sintaxis, lint, OpenAPI y tests antes de construir la imagen final.

Docker Compose agrega un healthcheck contra:

```text
http://localhost:3000/health
```

Esto demuestra que el contenedor no solo se construye, sino que responde.

---

## 21. GitHub Actions

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
- sintaxis JavaScript y JSON;
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

Si los secrets de Vercel no estan configurados, el job no rompe el pipeline: muestra una advertencia y saltea el deploy. Esto evita inventar credenciales y mantiene el repositorio demostrable.

Despues del deploy, puede enviar una notificacion por WhatsApp usando CallMeBot. Para evitar falsos positivos, el mensaje se manda solo si el paso de Vercel termino correctamente.

---

## 22. Vercel

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

## 23. Secretos de Vercel

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

## 24. Guion breve para exposicion

### Inicio

> "Este proyecto demuestra un flujo CI/CD completo sobre una API Express. Cada cambio subido a GitHub pasa por analisis, validacion de contrato, tests, build y Docker. Cuando el cambio llega aprobado a main, se despliega en Vercel."

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

> "El build local valida sintaxis, corre lint, valida OpenAPI y ejecuta tests. Si algo falla, el pipeline se detiene."

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

## 25. Preguntas que pueden hacer

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

## 26. Comandos para practicar antes de exponer

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

## 27. Cierre recomendado

> "El valor del proyecto no esta en que la API sea grande, sino en que el proceso es profesional: cada cambio se valida automaticamente, se prueba, se empaqueta, genera artefactos y se despliega en Vercel. Eso es justamente lo que busca CI/CD: reducir errores manuales y aumentar confianza en cada entrega."
