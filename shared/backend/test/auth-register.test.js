import test from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../src/db.js';
import errorHandler from '../src/middleware/errorHandler.js';
import * as authService from '../src/services/auth.service.js';

const datosRegistro = {
  nombre: 'María Quispe',
  email: 'MARIA@EXAMPLE.PE',
  password: 'clave-segura',
};

test('el registro confirma usuario y roles dentro de una transacción SQL', async (t) => {
  const consultas = [];
  let released = false;
  const client = {
    async query(sql, params = []) {
      const consulta = sql.trim().replace(/\s+/g, ' ');
      consultas.push({ consulta, params });
      if (consulta.startsWith('INSERT INTO usuarios')) {
        return {
          rows: [{ id: 42, nombre: 'María Quispe', email: 'maria@example.pe' }],
        };
      }
      return { rows: [] };
    },
    release() {
      released = true;
    },
  };
  t.mock.method(pool, 'connect', async () => client);

  const resultado = await authService.register(datosRegistro);

  assert.deepEqual(
    consultas.map(({ consulta }) => consulta.split(' ')[0]),
    ['BEGIN', 'INSERT', 'INSERT', 'COMMIT']
  );
  assert.match(consultas[1].consulta, /RETURNING id, nombre, email$/);
  assert.match(consultas[2].consulta, /'cliente'/);
  assert.deepEqual(consultas[2].params, [42]);
  assert.equal(resultado.usuario.id, 42);
  assert.equal(resultado.usuario.email, 'maria@example.pe');
  assert.equal(released, true);
});

test('el correo duplicado hace rollback y conserva el mensaje SQL', async (t) => {
  const consultas = [];
  let released = false;
  const errorSql = Object.assign(
    new Error('duplicate key value violates unique constraint "usuarios_email_key"'),
    { code: '23505' }
  );
  const client = {
    async query(sql) {
      const consulta = sql.trim().replace(/\s+/g, ' ');
      consultas.push(consulta);
      if (consulta.startsWith('INSERT INTO usuarios')) throw errorSql;
      return { rows: [] };
    },
    release() {
      released = true;
    },
  };
  t.mock.method(pool, 'connect', async () => client);

  await assert.rejects(authService.register(datosRegistro), (error) => {
    assert.equal(error.status, 400);
    assert.equal(error.message, errorSql.message);
    return true;
  });

  assert.deepEqual(consultas, ['BEGIN', expectInsert(), 'ROLLBACK']);
  assert.equal(released, true);
});

test('el middleware expone el mensaje de errores SQL marcados', (t) => {
  t.mock.method(console, 'error', () => {});
  const error = Object.assign(new Error('connection refused'), {
    expose: true,
  });
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  errorHandler(error, {}, response, assert.fail);

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, { mensaje: 'connection refused' });
});

function expectInsert() {
  return 'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3) RETURNING id, nombre, email';
}
