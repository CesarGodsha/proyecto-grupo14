import * as logisticaRepo from '../repositories/logistica.repository.js';
import AppError from '../utils/AppError.js';

const ESTADOS = ['registrado', 'confirmada', 'en_transito', 'entregado', 'rechazado'];

export function calcularTarifa(toneladas, matpel) {
  const t = Number(toneladas);
  if (!Number.isFinite(t) || t <= 0) {
    throw new AppError(400, 'El tonelaje debe ser un número mayor que cero');
  }
  if (typeof matpel !== 'boolean') {
    throw new AppError(400, 'El indicador MATPEL debe ser verdadero o falso');
  }
  const base = 450 + Math.max(0, t - 5) * 80;
  return Number((matpel ? base * 1.2 : base).toFixed(2));
}

function idOpcional(value, label) {
  if (value === null || value === undefined || value === '') return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, `${label} seleccionado no es válido`);
  }
  return id;
}

function validarDatos({ ruta, carga, toneladas, matpel }) {
  if (!String(ruta || '').trim() || !String(carga || '').trim()) {
    throw new AppError(400, 'Completa la ruta y descripción de carga');
  }
  calcularTarifa(toneladas, matpel);
}

export async function crear(usuario, datos) {
  const {
    cliente,
    ruta,
    carga,
    toneladas = 5,
    matpel = false,
    id_tramite = null,
  } = datos;
  validarDatos({ ruta, carga, toneladas, matpel });
  const monto = calcularTarifa(toneladas, matpel);
  const idTramite = idOpcional(id_tramite, 'El expediente GORE');
  if (
    idTramite !== null &&
    !(await logisticaRepo.puedeVincularTramite(
      idTramite,
      usuario.id,
      esStaff(usuario)
    ))
  ) {
    throw new AppError(404, 'No se encontró el expediente GORE seleccionado');
  }

  const id = await logisticaRepo.crearCotizacion({
    idUsuario: usuario.id,
    cliente: String(cliente || '').trim() || usuario.nombre,
    ruta: String(ruta).trim(),
    carga: String(carga).trim(),
    toneladas: Number(toneladas),
    matpel,
    monto,
    idTramite,
  });
  return {
    id,
    codigo: `COT-${String(id).padStart(5, '0')}`,
    monto_calculado: monto,
  };
}

export async function listarMias(idUsuario) {
  return logisticaRepo.listarMisCotizaciones(idUsuario);
}

export async function listarPermisosGore(usuario) {
  return logisticaRepo.listarPermisosGore(esStaff(usuario), usuario.id);
}

function esStaff(usuario) {
  return usuario.roles.some(
    ({ modulo, rol }) =>
      modulo === 'logistica' && ['administrador', 'empleado'].includes(rol)
  );
}

export async function actualizar(id, usuario, datos) {
  const {
    cliente,
    ruta,
    carga,
    toneladas,
    matpel = false,
    id_tramite = null,
  } = datos;
  validarDatos({ ruta, carga, toneladas, matpel });
  const monto = calcularTarifa(toneladas, matpel);
  const idTramite = idOpcional(id_tramite, 'El expediente GORE');
  if (
    idTramite !== null &&
    !(await logisticaRepo.puedeVincularTramite(
      idTramite,
      usuario.id,
      esStaff(usuario)
    ))
  ) {
    throw new AppError(404, 'No se encontró el expediente GORE seleccionado');
  }

  const rowCount = await logisticaRepo.actualizarCotizacion(
    id,
    usuario.id,
    esStaff(usuario),
    {
    cliente: String(cliente || '').trim(),
    ruta: String(ruta).trim(),
    carga: String(carga).trim(),
    toneladas: Number(toneladas),
    matpel,
    monto,
    idTramite,
    }
  );
  if (!rowCount) {
    throw new AppError(404, 'Solo se pueden editar cotizaciones en estado registrado');
  }
  return { mensaje: 'Cotización actualizada', monto_calculado: monto };
}

export async function listarTodas() {
  return logisticaRepo.listarTodasCotizaciones();
}

export async function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) {
    throw new AppError(400, 'Estado no válido');
  }

  if (estado === 'confirmada') {
    const info = await logisticaRepo.obtenerEstadoTramiteCotizacion(id);
    if (!info) throw new AppError(404, 'Cotización no encontrada');
    if (!info.id_tramite) {
      throw new AppError(400, 'No se puede confirmar: falta asociar un trámite de permiso del GORE.');
    }
    if (info.estado_tramite !== 'atendido') {
      throw new AppError(
        400,
        `No se puede confirmar: el permiso del GORE está en estado "${info.estado_tramite || 'pendiente'}" (debe estar "atendido").`
      );
    }
  }

  const rowCount = await logisticaRepo.actualizarEstadoCotizacion(id, estado);
  if (!rowCount) throw new AppError(404, 'Cotización no encontrada');
  return { mensaje: `Estado actualizado a ${estado}` };
}

export async function eliminar(id) {
  const rowCount = await logisticaRepo.eliminarCotizacion(id);
  if (!rowCount) throw new AppError(404, 'Cotización no encontrada');
  return { mensaje: 'Cotización eliminada' };
}
