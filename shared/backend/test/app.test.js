import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import authApp from '../../../portal/backend/app.js';
import goreApp from '../../../apps/gore-app/backend/app.js';
import logisticaApp from '../../../apps/logistica-app/backend/app.js';
import migracionesApp from '../../../apps/migraciones-app/backend/app.js';

function request(server, path, headers = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port: server.address().port,
        path,
        headers,
        method,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            body: JSON.parse(Buffer.concat(chunks).toString()),
            headers: res.headers,
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

for (const [service, serviceApp] of [
  ['auth', authApp],
  ['gore', goreApp],
  ['logistica', logisticaApp],
  ['migraciones', migracionesApp],
]) {
  test(`API independiente de ${service} expone su estado`, async (t) => {
    const server = serviceApp.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(
      async () =>
        new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        })
    );

    const health = await request(server, '/api/salud', {
      Origin: 'https://vercel-preview.example',
    });
    assert.equal(health.status, 200);
    assert.deepEqual(health.body, { ok: true, servicio: service });
    if (service !== 'auth') {
      assert.equal(health.headers['access-control-allow-origin'], '*');
    }
  });
}

test('expone salud y exige token para rutas privadas', async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret';
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(
    async () => {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
      if (previousSecret === undefined) delete process.env.JWT_SECRET;
      else process.env.JWT_SECRET = previousSecret;
    }
  );

  const health = await request(server, '/api/salud');
  assert.equal(health.status, 200);
  assert.deepEqual(health.body, { ok: true });

  const privateRoute = await request(server, '/api/migraciones/citas/mias');
  assert.equal(privateRoute.status, 401);
  assert.equal(privateRoute.body.mensaje, 'Inicia sesión para continuar');

  const clienteToken = jwt.sign(
    {
      id: 1,
      roles: [
        { modulo: 'gore', rol: 'cliente' },
        { modulo: 'logistica', rol: 'cliente' },
      ],
    },
    'test-secret'
  );
  const headers = { Authorization: `Bearer ${clienteToken}` };

  const goreStaffRoute = await request(
    server,
    '/api/gore/1',
    headers,
    'DELETE'
  );
  assert.equal(goreStaffRoute.status, 403);

  const empleadoGoreToken = jwt.sign(
    { id: 2, roles: [{ modulo: 'gore', rol: 'empleado' }] },
    'test-secret'
  );
  const goreDeleteAsEmployee = await request(
    server,
    '/api/gore/1',
    { Authorization: `Bearer ${empleadoGoreToken}` },
    'DELETE'
  );
  assert.equal(goreDeleteAsEmployee.status, 403);

  const logisticStaffRoute = await request(
    server,
    '/api/logistica/cotizaciones',
    headers
  );
  assert.equal(logisticStaffRoute.status, 403);

  const employeeToken = jwt.sign(
    {
      id: 3,
      roles: [
        { modulo: 'migraciones', rol: 'empleado' },
        { modulo: 'logistica', rol: 'empleado' },
      ],
    },
    'test-secret'
  );
  const employeeHeaders = { Authorization: `Bearer ${employeeToken}` };
  const adminToken = jwt.sign(
    {
      id: 4,
      roles: [
        { modulo: 'migraciones', rol: 'administrador' },
        { modulo: 'logistica', rol: 'administrador' },
      ],
    },
    'test-secret'
  );
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };

  for (const [modulo, requestHeaders] of [
    ['gore', { Authorization: `Bearer ${empleadoGoreToken}` }],
    ['logistica', employeeHeaders],
    ['migraciones', employeeHeaders],
  ]) {
    const response = await request(
      server,
      `/api/${modulo}/turnos`,
      requestHeaders
    );
    assert.equal(response.status, 403, `solo el administrador de ${modulo} gestiona turnos`);
  }

  for (const [path, method, requestHeaders] of [
    ['/api/migraciones/citas/mias', 'GET', employeeHeaders],
    ['/api/migraciones/citas', 'POST', adminHeaders],
    ['/api/migraciones/citas/1', 'PUT', employeeHeaders],
    ['/api/logistica/cotizaciones/mias', 'GET', employeeHeaders],
    ['/api/logistica/cotizaciones', 'POST', adminHeaders],
    ['/api/logistica/cotizaciones/1', 'PUT', employeeHeaders],
    ['/api/logistica/permisos-gore', 'GET', adminHeaders],
  ]) {
    const response = await request(server, path, requestHeaders, method);
    assert.equal(response.status, 403, `${method} ${path} debe ser solo de cliente`);
  }
});
