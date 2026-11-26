import app from './app.js';
import { pool } from './db.js';

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurado');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado');
  }

  await pool.query('SELECT 1');
  app.listen(PORT, () => {
    console.log(`API lista en http://localhost:${PORT}/api`);
  });
}

start().catch(async (error) => {
  console.error('No se pudo iniciar la API:', error.message);
  await pool.end();
  process.exitCode = 1;
});
