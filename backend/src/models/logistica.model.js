import { pool } from '../db.js';

// CAPA MODEL LOGISTICA: solo SQL, misma consulta SEL original
export const SEL = `
  SELECT
    c.id,
    'COT-' || LPAD(c.id::text, 5, '0') AS codigo,
    c.cliente,
    c.ruta,
    c.carga,
    c.toneladas,
    c.matpel,
    c.monto_calculado,
    c.id_tramite,
    CASE WHEN c.id_tramite IS NOT NULL THEN 'EXP-' || LPAD(c.id_tramite::text, 5, '0') ELSE NULL END AS codigo_tramite,
    t.estado AS estado_tramite,
    c.estado,
    c.id_usuario,
    cm.id AS id_cita,
    CASE WHEN cm.id IS NOT NULL THEN 'MIG-' || LPAD(cm.id::text, 5, '0') ELSE NULL END AS codigo_cita,
    cm.estado AS estado_cita,
    cm.fecha::text AS fecha_cita
  FROM cotizaciones_carga c
  LEFT JOIN tramites_mesa_partes t ON t.id = c.id_tramite
  LEFT JOIN citas_migraciones cm ON cm.id_cotizacion = c.id
`;

export async function create({ id_usuario, cliente, ruta, carga, toneladas, matpel, monto, tramiteId }) {
  const { rows } = await pool.query(
    "INSERT INTO cotizaciones_carga (id_usuario, cliente, ruta, carga, toneladas, matpel, monto_calculado, id_tramite, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'registrado') RETURNING id",
    [id_usuario, cliente, ruta, carga, toneladas, matpel, monto, tramiteId]
  );
  return rows[0];
}

export async function findMine(id_usuario) {
  const { rows } = await pool.query(SEL + ' WHERE c.id_usuario = $1 OR c.id_usuario IS NULL ORDER BY c.id DESC', [id_usuario]);
  return rows;
}

export async function findAll() {
  const { rows } = await pool.query(SEL + ' ORDER BY c.id DESC');
  return rows;
}

export async function findPermisosStaff() {
  const { rows } = await pool.query("SELECT id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, asunto, estado, id_usuario FROM tramites_mesa_partes ORDER BY id DESC");
  return rows;
}

export async function findPermisosMine(id_usuario) {
  const { rows } = await pool.query("SELECT id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, asunto, estado, id_usuario FROM tramites_mesa_partes WHERE id_usuario = $1 ORDER BY id DESC", [id_usuario]);
  return rows;
}

export async function updateIfRegistrado(id, { cliente, ruta, carga, toneladas, matpel, monto, tramiteId }) {
  const { rowCount } = await pool.query(
    'UPDATE cotizaciones_carga SET cliente=$1, ruta=$2, carga=$3, toneladas=$4, matpel=$5, monto_calculado=$6, id_tramite=$7 WHERE id=$8 AND estado=' + "'registrado'",
    [cliente, ruta, carga, toneladas, matpel, monto, tramiteId, id]
  );
  return rowCount;
}

export async function findTramiteCheck(id) {
  const { rows } = await pool.query(
    'SELECT c.id_tramite, t.estado AS estado_tramite FROM cotizaciones_carga c LEFT JOIN tramites_mesa_partes t ON t.id = c.id_tramite WHERE c.id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function updateEstado(id, estado) {
  await pool.query('UPDATE cotizaciones_carga SET estado=$1 WHERE id=$2', [estado, id]);
}

export async function remove(id) {
  await pool.query('DELETE FROM cotizaciones_carga WHERE id=$1', [id]);
}
