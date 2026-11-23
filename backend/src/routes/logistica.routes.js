import { Router } from 'express';
import { pool } from '../db.js';
import { autenticar, requireRol, w } from '../middleware/auth.js';

const r = Router();
r.use(autenticar, requireRol('logistica'));

const staff = requireRol('logistica', 'administrador', 'empleado');
const ESTADOS = ['registrado', 'confirmada', 'en_transito', 'entregado', 'rechazado'];

// Fórmula oficial Caso 35: S/ 450 hasta 5t + S/ 80 por tonelada extra (+20% si MATPEL)
function calcularTarifa(toneladas, matpel) {
  const t = Math.max(0.1, Number(toneladas) || 1);
  const base = 450 + Math.max(0, t - 5) * 80;
  return Number((matpel ? base * 1.2 : base).toFixed(2));
}

const SEL = `
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

// 1. Registrar nueva cotización (Cliente, Empleado o Admin)
r.post('/cotizaciones', w(async (req, res) => {
  const { cliente, ruta, carga, toneladas = 5, matpel = false, id_tramite = null } = req.body;
  if (!ruta || !carga) {
    return res.status(400).json({ mensaje: 'Completa la ruta y descripción de carga' });
  }

  const monto = calcularTarifa(toneladas, matpel);
  const nombreCliente = cliente || req.usuario.nombre;
  const tramiteId = id_tramite ? Number(id_tramite) : null;

  const { rows } = await pool.query(
    `INSERT INTO cotizaciones_carga (id_usuario, cliente, ruta, carga, toneladas, matpel, monto_calculado, id_tramite, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'registrado')
     RETURNING id`,
    [req.usuario.id, nombreCliente, ruta, carga, Number(toneladas), Boolean(matpel), monto, tramiteId]
  );

  res.status(201).json({
    id: rows[0].id,
    codigo: 'COT-' + String(rows[0].id).padStart(5, '0'),
    monto_calculado: monto
  });
}));

// 2. Consulta: mis cotizaciones / viajes asignados
r.get('/cotizaciones/mias', w(async (req, res) => {
  const { rows } = await pool.query(
    SEL + ' WHERE c.id_usuario = $1 OR c.id_usuario IS NULL ORDER BY c.id DESC',
    [req.usuario.id]
  );
  res.json(rows);
}));

// 3. Listar trámites disponibles del GORE para vincular en el formulario
r.get('/permisos-gore', w(async (req, res) => {
  const roles = Array.isArray(req.usuario?.roles) ? req.usuario.roles : [];
  const esStaff = roles.some(
    (rolItem) =>
      rolItem.modulo === 'logistica' &&
      ['administrador', 'empleado'].includes(String(rolItem.rol).toLowerCase())
  );

  if (esStaff) {
    const { rows } = await pool.query(
      `SELECT id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, asunto, estado, id_usuario
       FROM tramites_mesa_partes
       ORDER BY id DESC`
    );
    return res.json(rows);
  }

  const { rows } = await pool.query(
    `SELECT id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, asunto, estado, id_usuario
     FROM tramites_mesa_partes
     WHERE id_usuario = $1
     ORDER BY id DESC`,
    [req.usuario.id]
  );
  res.json(rows);
}));

// 4. Actualizar cotización (solo si sigue en estado 'registrado')
r.put('/cotizaciones/:id', w(async (req, res) => {
  const { cliente, ruta, carga, toneladas, matpel, id_tramite = null } = req.body;
  const monto = calcularTarifa(toneladas, matpel);
  const tramiteId = id_tramite ? Number(id_tramite) : null;

  const { rowCount } = await pool.query(
    `UPDATE cotizaciones_carga 
     SET cliente=$1, ruta=$2, carga=$3, toneladas=$4, matpel=$5, monto_calculado=$6, id_tramite=$7
     WHERE id=$8 AND estado='registrado'`,
    [cliente, ruta, carga, Number(toneladas), Boolean(matpel), monto, tramiteId, req.params.id]
  );

  if (!rowCount) {
    return res.status(404).json({ mensaje: 'Solo se pueden editar cotizaciones en estado registrado' });
  }
  res.json({ mensaje: 'Cotización actualizada', monto_calculado: monto });
}));

// 5. Panel (Administrador y Empleado): ver todas con JOIN completo (HU-14.4)
r.get('/cotizaciones', staff, w(async (req, res) => {
  const { rows } = await pool.query(SEL + ' ORDER BY c.id DESC');
  res.json(rows);
}));

// 6. Cambiar estado con validación HU-14.2 (Solo confirma si el trámite GORE está 'atendido')
r.patch('/cotizaciones/:id/estado', staff, w(async (req, res) => {
  const { estado } = req.body;
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }

  if (estado === 'confirmada') {
    const check = await pool.query(
      `SELECT c.id_tramite, t.estado AS estado_tramite
       FROM cotizaciones_carga c
       LEFT JOIN tramites_mesa_partes t ON t.id = c.id_tramite
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (!check.rows.length) {
      return res.status(404).json({ mensaje: 'Cotización no encontrada' });
    }

    const { id_tramite, estado_tramite } = check.rows[0];
    if (!id_tramite) {
      return res.status(400).json({ mensaje: 'No se puede confirmar: falta asociar un trámite de permiso del GORE.' });
    }
    if (estado_tramite !== 'atendido') {
      return res.status(400).json({ mensaje: `No se puede confirmar: el permiso del GORE está en estado "${estado_tramite || 'pendiente'}" (debe estar "atendido").` });
    }
  }

  await pool.query('UPDATE cotizaciones_carga SET estado=$1 WHERE id=$2', [estado, req.params.id]);
  res.json({ mensaje: `Estado actualizado a ${estado}` });
}));

// 7. Eliminar cotización (Solo Administrador)
r.delete('/cotizaciones/:id', requireRol('logistica', 'administrador'), w(async (req, res) => {
  await pool.query('DELETE FROM cotizaciones_carga WHERE id=$1', [req.params.id]);
  res.json({ mensaje: 'Cotización eliminada' });
}));

export default r;