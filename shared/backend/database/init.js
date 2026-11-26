import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import bcrypt from 'bcryptjs';

dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

async function seedTramitesPorModulo() {
  // Obtiene usuarios de prueba (cliente1..cliente30) o todos si no coinciden
  let { rows: usuarios } = await pool.query(
    `SELECT id, nombre FROM usuarios WHERE email LIKE 'cliente%@correo.pe' ORDER BY id ASC`
  );
  if (usuarios.length === 0) {
    const fallback = await pool.query(`SELECT id, nombre FROM usuarios ORDER BY id ASC`);
    usuarios = fallback.rows;
  }
  if (usuarios.length === 0) {
    throw new Error('No hay usuarios disponibles para asignar los trámites.');
  }

  const getUsuario = (idx) => usuarios[idx % usuarios.length];

  // 1. Módulo Migraciones: 30 registros en citas_migraciones
  const { rows: migCount } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM citas_migraciones`
  );
  if (migCount[0].total < 30) {
    const faltanMig = 30 - migCount[0].total;
    for (let i = 1; i <= faltanMig; i++) {
      const nro = migCount[0].total + i;
      const usr = getUsuario(nro - 1);
      await pool.query(
        `INSERT INTO citas_migraciones (id_usuario, tramite, fecha, hora, estado)
         VALUES ($1, $2::varchar, CURRENT_DATE + $3::int, '09:00'::time, 'registrado'::varchar)`,
        [
          usr.id,
          `Trámite Migración #${nro}`,
          nro,
        ]
      );
    }
  }

  // 2. Módulo LogísticaMax: 30 registros en cotizaciones_carga (incluye id_usuario del nuevo schema)
  const { rows: logCount } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM cotizaciones_carga`
  );
  if (logCount[0].total < 30) {
    const faltanLog = 30 - logCount[0].total;
    for (let i = 1; i <= faltanLog; i++) {
      const nro = logCount[0].total + i;
      const usr = getUsuario(nro + 9);
      await pool.query(
        `INSERT INTO cotizaciones_carga (id_usuario, cliente, ruta, carga, toneladas, matpel, monto_calculado, estado)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          usr.id,
          usr.nombre,
          `Ruta Huancayo - Lima #${nro}`,
          `Carga general #${nro}`,
          1.00,
          false,
          450.00,
          'registrado',
        ]
      );
    }
  }

  // 3. Módulo GORE Junín: 30 registros en tramites_mesa_partes
  const { rows: goreCount } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM tramites_mesa_partes`
  );
  if (goreCount[0].total < 30) {
    const faltanGore = 30 - goreCount[0].total;
    for (let i = 1; i <= faltanGore; i++) {
      const nro = goreCount[0].total + i;
      const usr = getUsuario(nro + 19);
      await pool.query(
        `INSERT INTO tramites_mesa_partes (id_usuario, asunto, documento, estado)
         VALUES ($1, $2, $3, $4)`,
        [
          usr.id,
          `Asunto Mesa de Partes #${nro}`,
          `DOC-2026-${String(nro).padStart(3, '0')}`,
          'registrado',
        ]
      );
    }
  }
}

async function init() {
  try {
    const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
    await pool.query(schema);

    const hash = await bcrypt.hash('123456', 10);

    // 30 clientes de prueba (Cliente 1 .. Cliente 30) con rol 'cliente' en los 3 módulos
    const clientesLista = Array.from({ length: 30 }, (_, idx) => {
      const num = idx + 1;
      return {
        nombre: `Cliente ${num}`,
        email: `cliente${num}@correo.pe`,
      };
    });

    for (const cli of clientesLista) {
      const { rows } = await pool.query(
        `INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3)
         ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id`,
        [cli.nombre, cli.email, hash]
      );
      for (const m of ['logistica', 'gore', 'migraciones']) {
        await pool.query(
          `INSERT INTO usuario_rol (id_usuario, modulo, rol) VALUES ($1,$2,'cliente')
           ON CONFLICT (id_usuario, modulo) DO NOTHING`,
          [rows[0].id, m]
        );
      }
    }

    // 3 citas por cliente (solo si la tabla está vacía)
    const { rows: n } = await pool.query('SELECT COUNT(*)::int AS total FROM citas_migraciones');
    if (n[0].total === 0) {
      await pool.query(
        `INSERT INTO citas_migraciones (id_usuario, tramite, fecha, hora, estado)
         SELECT u.id, 'Pasaporte'::varchar, CURRENT_DATE + g, '08:00'::time, 'registrado'::varchar
         FROM usuarios u, generate_series(1,3) g WHERE u.email LIKE 'cliente%@correo.pe'`
      );
    }

    // 30 registros por cada módulo (90 en total) respetando mínimos y sin duplicar al reejecutar
    await seedTramitesPorModulo();

    console.log('Tablas listas, usuarios de prueba creados (contraseña 123456) y 30 trámites por módulo asegurados');
  } catch (err) {
    console.error('Error en init.js:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

init();