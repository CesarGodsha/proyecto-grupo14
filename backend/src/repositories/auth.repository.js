import { pool } from '../db.js';

export async function crearUsuario(nombre, email, passwordHash) {
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING RETURNING id',
    [nombre, email, passwordHash]
  );
  return rows[0] || null;
}

export async function asignarRolesIniciales(idUsuario) {
  for (const m of ['logistica', 'gore', 'migraciones']) {
    await pool.query(
      "INSERT INTO usuario_rol (id_usuario, modulo, rol) VALUES ($1,$2,'cliente')",
      [idUsuario, m]
    );
  }
}

export async function buscarPorEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nombre, password_hash FROM usuarios WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

export async function obtenerRolesPorUsuario(idUsuario) {
  const { rows } = await pool.query(
    'SELECT modulo, rol FROM usuario_rol WHERE id_usuario = $1',
    [idUsuario]
  );
  return rows;
}