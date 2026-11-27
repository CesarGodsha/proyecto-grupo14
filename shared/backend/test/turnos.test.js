import test from 'node:test';
import assert from 'node:assert/strict';
import { crearControlTurno, estaDentroDeTurno } from '../src/middleware/turnos.js';

test('comprueba horarios diarios y turnos que cruzan medianoche', () => {
  assert.equal(estaDentroDeTurno('08:00:00', '17:00:00', 480), true);
  assert.equal(estaDentroDeTurno('08:00:00', '17:00:00', 1019), true);
  assert.equal(estaDentroDeTurno('08:00:00', '17:00:00', 1020), false);
  assert.equal(estaDentroDeTurno('22:00:00', '06:00:00', 60), true);
  assert.equal(estaDentroDeTurno('22:00:00', '06:00:00', 360), false);
});

test('permite empleados sin turno configurado y omite administradores', async () => {
  let consultas = 0;
  const controlar = crearControlTurno({
    obtenerTurno: async () => {
      consultas += 1;
      return null;
    },
    obtenerMinutoActual: () => 60,
  });
  const next = () => {};
  const response = { status() { return this; }, json() {} };

  await controlar('gore')(
    { usuario: { id: 1, roles: [{ modulo: 'gore', rol: 'empleado' }] } },
    response,
    next
  );
  await controlar('gore')(
    { usuario: { id: 2, roles: [{ modulo: 'gore', rol: 'administrador' }] } },
    response,
    next
  );

  assert.equal(consultas, 1);
});

test('bloquea a un empleado fuera del turno y propaga fallos de consulta', async () => {
  let status;
  let body;
  let nextError;
  const response = {
    status(value) { status = value; return this; },
    json(value) { body = value; },
  };
  const empleado = {
    usuario: { id: 1, roles: [{ modulo: 'logistica', rol: 'empleado' }] },
  };

  await crearControlTurno({
    obtenerTurno: async () => ({ hora_inicio: '08:00:00', hora_fin: '17:00:00' }),
    obtenerMinutoActual: () => 1020,
  })('logistica')(empleado, response, (error) => { nextError = error; });

  assert.equal(status, 403);
  assert.match(body.mensaje, /fuera del horario/);
  assert.equal(nextError, undefined);

  const fallo = new Error('database unavailable');
  await crearControlTurno({
    obtenerTurno: async () => { throw fallo; },
  })('logistica')(empleado, response, (error) => { nextError = error; });
  assert.equal(nextError, fallo);
});

test('permite a un empleado operar dentro de su turno', async () => {
  let continuo = false;
  await crearControlTurno({
    obtenerTurno: async () => ({ hora_inicio: '08:00:00', hora_fin: '17:00:00' }),
    obtenerMinutoActual: () => 480,
  })('migraciones')(
    { usuario: { id: 8, roles: [{ modulo: 'migraciones', rol: 'empleado' }] } },
    {},
    () => { continuo = true; }
  );
  assert.equal(continuo, true);
});
