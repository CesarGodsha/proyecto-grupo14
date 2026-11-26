import { pool } from './db.js';

export default async function startServer(app, service, defaultPort) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }

    await pool.query('SELECT 1');
    const port = Number(process.env.PORT) || defaultPort;
    app.listen(port, () => {
      console.log(`${service} API lista en http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error(`No se pudo iniciar ${service}:`, error.message);
    await pool.end();
    process.exitCode = 1;
  }
}
