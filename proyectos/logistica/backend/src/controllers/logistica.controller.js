import { w } from '../middleware/auth.js';
import * as logisticaRepo from '../repositories/logistica.repository.js';

const ESTADOS = ['registrado', 'confirmada', 'en_transito', 'entregado', 'rechazado'];

function calcularTarifa(toneladas, matpel) {
  const t = Math.max(0.1, Number(toneladas) || 1);
  const base = 450 + Math.max(0, t - 5) * 80;
  return Number((matpel ? base * 1.2 : base).toFixed(2));
}

export const crear = w(async (req, res) => {
  const { cliente, ruta, carga, toneladas = 5, matpel = false, id_tramite = null } = req.body;
  if (!ruta || !carga) {
    return res.status(400).json({ mensaje: 'Completa la ruta y descripción de carga' });
  }

  const monto = calcularTarifa(toneladas, matpel);
  const nombreCliente = cliente || req.usuario.nombre;
  const tramiteId = id_tramite ? Number(id_tramite) : null;

  const id = await logisticaRepo.crearCotizacion({
    idUsuario: req.usuario.id,
    cliente: nombreCliente,
    ruta,
    carga,
    toneladas: Number(toneladas),
    matpel: Boolean(matpel),
    monto,
    idTramite: tramiteId,
  });

  res.status(201).json({
    id,
    codigo: 'COT-' + String(id).padStart(5, '0'),
    monto_calculado: monto,
  });
});

export const listarMias = w(async (req, res) => {
  const rows = await logisticaRepo.listarMisCotizaciones(req.usuario.id);
  res.json(rows);
});

export const listarPermisosGore = w(async (req, res) => {
  const roles = Array.isArray(req.usuario?.roles) ? req.usuario.roles : [];
  const esStaff = roles.some(
    (rolItem) =>
      rolItem.modulo === 'logistica' &&
      ['administrador', 'empleado'].includes(String(rolItem.rol).toLowerCase())
  );

  const rows = await logisticaRepo.listarPermisosGore(esStaff, req.usuario.id);
  res.json(rows);
});

export const actualizar = w(async (req, res) => {
  const { cliente, ruta, carga, toneladas, matpel, id_tramite = null } = req.body;
  const monto = calcularTarifa(toneladas, matpel);
  const tramiteId = id_tramite ? Number(id_tramite) : null;

  const rowCount = await logisticaRepo.actualizarCotizacion(req.params.id, {
    cliente,
    ruta,
    carga,
    toneladas: Number(toneladas),
    matpel: Boolean(matpel),
    monto,
    idTramite: tramiteId,
  });

  if (!rowCount) {
    return res.status(404).json({ mensaje: 'Solo se pueden editar cotizaciones en estado registrado' });
  }
  res.json({ mensaje: 'Cotización actualizada', monto_calculado: monto });
});

export const listarTodas = w(async (req, res) => {
  const rows = await logisticaRepo.listarTodasCotizaciones();
  res.json(rows);
});

export const cambiarEstado = w(async (req, res) => {
  const { estado } = req.body;
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }

  if (estado === 'confirmada') {
    const info = await logisticaRepo.obtenerEstadoTramiteCotizacion(req.params.id);

    if (!info) {
      return res.status(404).json({ mensaje: 'Cotización no encontrada' });
    }
    if (!info.id_tramite) {
      return res.status(400).json({ mensaje: 'No se puede confirmar: falta asociar un trámite de permiso del GORE.' });
    }
    if (info.estado_tramite !== 'atendido') {
      return res.status(400).json({
        mensaje: `No se puede confirmar: el permiso del GORE está en estado "${info.estado_tramite || 'pendiente'}" (debe estar "atendido").`,
      });
    }
  }

  await logisticaRepo.actualizarEstadoCotizacion(req.params.id, estado);
  res.json({ mensaje: `Estado actualizado a ${estado}` });
});

export const eliminar = w(async (req, res) => {
  await logisticaRepo.eliminarCotizacion(req.params.id);
  res.json({ mensaje: 'Cotización eliminada' });
});