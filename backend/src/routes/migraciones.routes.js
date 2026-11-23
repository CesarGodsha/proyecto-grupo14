import { Router } from 'express';
import { pool } from '../db.js';
import { autenticar, requireRol, w } from '../middleware/auth.js';

const r = Router();
r.use(autenticar, requireRol('migraciones'));
const staff = requireRol('migraciones', 'administrador', 'empleado');
const ESTADOS = ['registrado', 'confirmada', 'rechazado'];
const SEL = `SELECT c.id, 'MIG-' || LPAD(c.id::text, 5, '0') AS codigo, c.tramite, c.fecha::text, LEFT(c.hora::text, 5) AS hora,
  c.estado, c.id_cotizacion, u.nombre AS ciudadano FROM citas_migraciones c JOIN usuarios u ON u.id = c.id_usuario`;

// Crear cita (cualquier usuario con rol en migraciones)
r.post('/citas', w(async (req, res) => {
  const { tramite, fecha, hora, id_cotizacion = null } = req.body;
  if (!tramite || !fecha || !hora) return res.status(400).json({ mensaje: 'Completa trámite, fecha y hora' });
  const { rows } = await pool.query(
    'INSERT INTO citas_migraciones (id_usuario, id_cotizacion, tramite, fecha, hora) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [req.usuario.id, id_cotizacion, tramite, fecha, hora]
  );
  res.status(201).json({ id: rows[0].id, codigo: 'MIG-' + String(rows[0].id).padStart(5, '0') });
}));

// Consulta: mis citas
r.get('/citas/mias', w(async (req, res) => {
  const { rows } = await pool.query(SEL + ' WHERE c.id_usuario = $1 ORDER BY c.id DESC', [req.usuario.id]);
  res.json(rows);
}));

// Actualizar: solo mis citas que sigan "registrado"
r.put('/citas/:id', w(async (req, res) => {
  const { tramite, fecha, hora } = req.body;
  const { rowCount } = await pool.query(
    "UPDATE citas_migraciones SET tramite=$1, fecha=$2, hora=$3 WHERE id=$4 AND id_usuario=$5 AND estado='registrado'",
    [tramite, fecha, hora, req.params.id, req.usuario.id]
  );
  if (!rowCount) return res.status(404).json({ mensaje: 'No se puede modificar esta cita' });
  res.json({ mensaje: 'Cita actualizada' });
}));

// Panel (administrador y empleado): ver todas, cambiar estado
r.get('/citas', staff, w(async (req, res) => {
  const { rows } = await pool.query(SEL + ' ORDER BY c.id DESC');
  res.json(rows);
}));

r.patch('/citas/:id/estado', staff, w(async (req, res) => {
  if (!ESTADOS.includes(req.body.estado)) return res.status(400).json({ mensaje: 'Estado no válido' });
  await pool.query('UPDATE citas_migraciones SET estado=$1 WHERE id=$2', [req.body.estado, req.params.id]);
  res.json({ mensaje: 'Estado actualizado' });
}));

// Eliminar (solo administrador)
r.delete('/citas/:id', requireRol('migraciones', 'administrador'), w(async (req, res) => {
  await pool.query('DELETE FROM citas_migraciones WHERE id=$1', [req.params.id]);
  res.json({ mensaje: 'Cita eliminada' });
}));

export default r;