import { pool } from '../db.js';

const SEL = `
  SELECT c.id, 'MIG-' || LPAD(c.id::text, 5, '0') AS codigo, c.tramite, c.fecha::text, LEFT(c.hora::text, 5) AS hora,
    c.estado, c.id_cotizacion, u.nombre AS ciudadano
  FROM citas_migraciones c
  JOIN usuarios u ON u.id = c.id_usuario
`;

export async function crearCita({ idUsuario, idCotizacion, tramite, fecha, hora }) {
  const { rows } = await pool.query(
    `INSERT INTO citas_migraciones (id_usuario, id_cotizacion, tramite, fecha, hora)
     SELECT $1, $2, $3, $4, $5
     WHERE $2::int IS NULL OR EXISTS (
       SELECT 1 FROM cotizaciones_carga WHERE id = $2 AND id_usuario = $1
     )
     RETURNING id`,
    [idUsuario, idCotizacion, tramite, fecha, hora]
  );
  return rows[0]?.id || null;
}

export async function listarMisCitas(idUsuario) {
  const { rows } = await pool.query(SEL + ' WHERE c.id_usuario = $1 ORDER BY c.id DESC', [idUsuario]);
  return rows;
}

export async function actualizarCita(id, idUsuario, { tramite, fecha, hora }) {
  const { rowCount } = await pool.query(
    "UPDATE citas_migraciones SET tramite=$1, fecha=$2, hora=$3 WHERE id=$4 AND id_usuario=$5 AND estado='registrado'",
    [tramite, fecha, hora, id, idUsuario]
  );
  return rowCount;
}

export async function listarTodasCitas() {
  const { rows } = await pool.query(SEL + ' ORDER BY c.id DESC');
  return rows;
}

export async function actualizarEstadoCita(id, estado) {
  const { rowCount } = await pool.query(
    'UPDATE citas_migraciones SET estado=$1 WHERE id=$2',
    [estado, id]
  );
  return rowCount;
}

export async function eliminarCita(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM citas_migraciones WHERE id=$1',
    [id]
  );
  return rowCount;
}