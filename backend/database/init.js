import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

async function init() {
  try {
    const hash = await bcrypt.hash('123456', 10);

    // 10 clientes existentes renombrados como clientes de Migraciones + 20 nuevos (10 Logística, 10 GORE)
    const clientesLista = [
      // 10 clientes que ya existían (renombrados como clientes de Migraciones)
      { nombre: 'Cliente 1 Migración', email: 'cliente1@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 2 Migración', email: 'cliente2@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 3 Migración', email: 'cliente3@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 4 Migración', email: 'cliente4@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 5 Migración', email: 'cliente5@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 6 Migración', email: 'cliente6@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 7 Migración', email: 'cliente7@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 8 Migración', email: 'cliente8@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 9 Migración', email: 'cliente9@correo.pe', modulos: ['migraciones'] },
      { nombre: 'Cliente 10 Migración', email: 'cliente10@correo.pe', modulos: ['migraciones'] },

      // 10 clientes nuevos para Logística
      { nombre: 'Cliente 1 Logística', email: 'cliente11@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 2 Logística', email: 'cliente12@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 3 Logística', email: 'cliente13@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 4 Logística', email: 'cliente14@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 5 Logística', email: 'cliente15@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 6 Logística', email: 'cliente16@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 7 Logística', email: 'cliente17@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 8 Logística', email: 'cliente18@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 9 Logística', email: 'cliente19@correo.pe', modulos: ['logistica'] },
      { nombre: 'Cliente 10 Logística', email: 'cliente20@correo.pe', modulos: ['logistica'] },

      // 10 clientes nuevos para GORE
      { nombre: 'Cliente 1 GORE', email: 'cliente21@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 2 GORE', email: 'cliente22@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 3 GORE', email: 'cliente23@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 4 GORE', email: 'cliente24@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 5 GORE', email: 'cliente25@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 6 GORE', email: 'cliente26@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 7 GORE', email: 'cliente27@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 8 GORE', email: 'cliente28@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 9 GORE', email: 'cliente29@correo.pe', modulos: ['gore'] },
      { nombre: 'Cliente 10 GORE', email: 'cliente30@correo.pe', modulos: ['gore'] },
    ];

    for (const cli of clientesLista) {
      const { rows } = await pool.query(
        `INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3)
         ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id`,
        [cli.nombre, cli.email, hash]
      );
      for (const m of cli.modulos) {
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

    console.log('Tablas listas y usuarios de prueba creados (contraseña 123456)');
  } catch (err) {
    console.error('Error en init.js:', err);
  } finally {
    await pool.end();
  }
}

init();