import 'dotenv/config';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { pool } from '../src/db.js';

// Usuarios de prueba (contraseña: 123456) y sus roles por módulo
const USUARIOS = [
  ['Admin LogísticaMax', 'admin@logisticamax.pe', [['logistica', 'administrador'], ['gore', 'cliente']]],
  ['Empleado LogísticaMax', 'empleado1@logisticamax.pe', [['logistica', 'empleado']]],
  ['Conductor 1', 'conductor1@logisticamax.pe', [['logistica', 'empleado'], ['migraciones', 'cliente']]],
  ['Admin GORE', 'admin@gore.pe', [['gore', 'administrador']]],
  ['Empleado GORE', 'empleado@gore.pe', [['gore', 'empleado']]],
  ['Admin Migraciones', 'admin@migraciones.pe', [['migraciones', 'administrador']]],
  ['Empleado Migraciones', 'empleado@migraciones.pe', [['migraciones', 'empleado']]]
];

await pool.query(fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
const hash = await bcrypt.hash('123456', 10);
for (const [nombre, email, roles] of USUARIOS) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3)
     ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id`,
    [nombre, email, hash]
  );
  for (const [modulo, rol] of roles) {
    await pool.query(
      `INSERT INTO usuario_rol (id_usuario, modulo, rol) VALUES ($1,$2,$3)
       ON CONFLICT (id_usuario, modulo) DO UPDATE SET rol = EXCLUDED.rol`,
      [rows[0].id, modulo, rol]
    );
  }
}
console.log('Tablas listas y usuarios de prueba creados (contraseña 123456)');
await pool.end();
