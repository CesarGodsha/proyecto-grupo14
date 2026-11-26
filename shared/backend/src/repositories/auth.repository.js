import { pool } from '../db.js';

export async function crearUsuarioConRoles({ nombre, email, passwordHash }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3) RETURNING id, nombre, email',
      [nombre, email, passwordHash]
    );

    await client.query(
      `INSERT INTO usuario_rol (id_usuario, modulo, rol)
       SELECT $1, modulo, 'cliente'
       FROM unnest(ARRAY['logistica', 'gore', 'migraciones']) AS modulos(modulo)`,
      [rows[0].id]
    );
    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('No se pudo revertir la transacción de registro:', rollbackError);
    }
    throw error;
  } finally {
    client.release();
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