import { pool } from '../db.js';

export async function listarTramites({ estado, q, idUsuario }) {
  let sql = `
    SELECT 
      t.id,
      'EXP-' || LPAD(t.id::text, 5, '0') AS codigo,
      t.id_usuario,
      COALESCE(u.nombre, 'Administrado #' || t.id_usuario) AS administrado,
      t.asunto,
      t.documento,
      t.estado,
      t.creado_en
    FROM tramites_mesa_partes t
    LEFT JOIN usuarios u ON u.id = t.id_usuario
  `;
  const params = [];
  const filters = [];
  if (idUsuario !== null) {
    params.push(idUsuario);
    filters.push(`t.id_usuario = $${params.length}`);
  }
  if (estado) {
    params.push(estado);
    filters.push(`t.estado = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    const placeholder = `$${params.length}`;
    filters.push(`(
      t.id::text ILIKE ${placeholder}
      OR ('EXP-' || LPAD(t.id::text, 5, '0')) ILIKE ${placeholder}
      OR COALESCE(u.nombre, '') ILIKE ${placeholder}
      OR t.asunto ILIKE ${placeholder}
    )`);
  }
  if (filters.length) sql += ` WHERE ${filters.join(' AND ')}`;

  sql += ` ORDER BY t.id DESC`;

  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function crearTramite(idUsuario, asunto, documento) {
  const { rows } = await pool.query(
    `INSERT INTO tramites_mesa_partes (id_usuario, asunto, documento, estado)
     VALUES ($1, $2, $3, 'registrado')
     RETURNING id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, id_usuario, asunto, documento, estado, creado_en`,
    [idUsuario, asunto, documento]
  );
  return rows[0];
}

export async function actualizarTramite(id, { estado, asunto, documento }) {
  const { rows } = await pool.query(
    `UPDATE tramites_mesa_partes
     SET estado = COALESCE($1, estado),
         asunto = COALESCE($2, asunto),
         documento = COALESCE($3, documento)
     WHERE id = $4
     RETURNING id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, id_usuario, asunto, documento, estado, creado_en`,
    [estado || null, asunto || null, documento || null, id]
  );
  return rows[0] || null;
}

export async function eliminarTramite(id) {
  const { rowCount } = await pool.query(
    `DELETE FROM tramites_mesa_partes WHERE id = $1`,
    [id]
  );
  return rowCount;
}