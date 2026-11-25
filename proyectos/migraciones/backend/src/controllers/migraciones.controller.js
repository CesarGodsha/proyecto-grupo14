import { w } from '../middleware/auth.js';
import * as migracionesRepo from '../services/migraciones.service.js';

const ESTADOS = ['registrado', 'confirmada', 'rechazado'];

export const crear = w(async (req, res) => {
  const { tramite, fecha, hora, id_cotizacion = null } = req.body;
  if (!tramite || !fecha || !hora) {
    return res.status(400).json({ mensaje: 'Completa trÃ¡mite, fecha y hora' });
  }

  const id = await migracionesRepo.crearCita({
    idUsuario: req.usuario.id,
    idCotizacion: id_cotizacion,
    tramite,
    fecha,
    hora,
  });

  res.status(201).json({
    id,
    codigo: 'MIG-' + String(id).padStart(5, '0'),
  });
});

export const listarMias = w(async (req, res) => {
  const rows = await migracionesRepo.listarMisCitas(req.usuario.id);
  res.json(rows);
});

export const actualizar = w(async (req, res) => {
  const { tramite, fecha, hora } = req.body;
  const rowCount = await migracionesRepo.actualizarCita(req.params.id, req.usuario.id, {
    tramite,
    fecha,
    hora,
  });

  if (!rowCount) {
    return res.status(404).json({ mensaje: 'No se puede modificar esta cita' });
  }
  res.json({ mensaje: 'Cita actualizada' });
});

export const listarTodas = w(async (req, res) => {
  const rows = await migracionesRepo.listarTodasCitas();
  res.json(rows);
});

export const cambiarEstado = w(async (req, res) => {
  if (!ESTADOS.includes(req.body.estado)) {
    return res.status(400).json({ mensaje: 'Estado no vÃ¡lido' });
  }
  await migracionesRepo.actualizarEstadoCita(req.params.id, req.body.estado);
  res.json({ mensaje: 'Estado actualizado' });
});

export const eliminar = w(async (req, res) => {
  await migracionesRepo.eliminarCita(req.params.id);
  res.json({ mensaje: 'Cita eliminada' });
});