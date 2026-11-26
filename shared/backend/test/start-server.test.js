import test from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../src/db.js';
import startServer from '../src/startServer.js';

test('el servidor prioriza PORT y usa el puerto local como respaldo', async (t) => {
  const previous = {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
  };
  t.after(() => {
    for (const [key, value] of Object.entries({
      PORT: previous.port,
      DATABASE_URL: previous.databaseUrl,
      JWT_SECRET: previous.jwtSecret,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  process.env.PORT = '4567';
  process.env.DATABASE_URL = 'postgres://test';
  process.env.JWT_SECRET = 'test-secret';
  t.mock.method(pool, 'query', async () => ({ rows: [{ '?column?': 1 }] }));

  let listenedPort;
  const app = {
    listen(port) {
      listenedPort = port;
    },
  };

  await startServer(app, 'test', 3001);

  assert.equal(listenedPort, 4567);

  delete process.env.PORT;
  await startServer(app, 'test', 3001);
  assert.equal(listenedPort, 3001);
});
