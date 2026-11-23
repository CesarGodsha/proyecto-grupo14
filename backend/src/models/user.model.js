import { pool } from '../db.js';

// CAPA MODEL: solo SQL de usuarios y roles, sin logica de negocio
export async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nombre, password_hash FROM usuarios WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

export async function createUser(nombre, email, hash) {
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING RETURNING id',
    [nombre, email, hash]
  );
  return rows[0] || null;
}

export async function assignDefaultRoles(id_usuario) {
  for (const m of ['logistica', 'gore', 'migraciones']) {
    await pool.query(
      "INSERT INTO usuario_rol (id_usuario, modulo, rol) VALUES ($1,$2,'cliente')",
      [id_usuario, m]
    );
  }
}

export async function getRoles(id_usuario) {
  const { rows } = await pool.query(
    'SELECT modulo, rol FROM usuario_rol WHERE id_usuario = $1',
    [id_usuario]
  );
  return rows;
}
