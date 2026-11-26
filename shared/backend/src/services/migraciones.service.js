import * as migracionesRepo from '../repositories/migraciones.repository.js';
import AppError from '../utils/AppError.js';

const ESTADOS = ['registrado', 'confirmada', 'rechazado'];

function validarFechaHora({ tramite, fecha, hora }) {
  if (!String(tramite || '').trim() || !fecha || !hora) {
    throw new AppError(400, 'Completa trámite, fecha y hora');
  }
  const fechaValida =
    /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
    Number.isFinite(Date.parse(`${fecha}T00:00:00Z`)) &&
    new Date(`${fecha}T00:00:00Z`).toISOString().slice(0, 10) === fecha;
  if (!fechaValida || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    throw new AppError(400, 'Ingresa una fecha y hora válidas');
  }
}

export async function crear(usuario, datos) {
  const { tramite, fecha, hora, id_cotizacion = null } = datos;
  validarFechaHora({ tramite, fecha, hora });
  const idCotizacion =
    id_cotizacion === null || id_cotizacion === '' ? null : Number(id_cotizacion);
  if (
    idCotizacion !== null &&
    (!Number.isInteger(idCotizacion) || idCotizacion < 1)
  ) {
    throw new AppError(400, 'La cotización seleccionada no es válida');
  }

  const id = await migracionesRepo.crearCita({
    idUsuario: usuario.id,
    idCotizacion,
    tramite: String(tramite).trim(),
    fecha,
    hora,
  });
  if (!id) {
    throw new AppError(404, 'No se encontró la cotización seleccionada');
  }
  return { id, codigo: `MIG-${String(id).padStart(5, '0')}` };
}

export async function listarMias(idUsuario) {
  return migracionesRepo.listarMisCitas(idUsuario);
}

export async function actualizar(id, idUsuario, datos) {
  validarFechaHora(datos);
  const rowCount = await migracionesRepo.actualizarCita(id, idUsuario, {
    tramite: String(datos.tramite).trim(),
    fecha: datos.fecha,
    hora: datos.hora,
  });
  if (!rowCount) throw new AppError(404, 'No se puede modificar esta cita');
  return { mensaje: 'Cita actualizada' };
}

export async function listarTodas() {
  return migracionesRepo.listarTodasCitas();
}

export async function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) throw new AppError(400, 'Estado no válido');
  const rowCount = await migracionesRepo.actualizarEstadoCita(id, estado);
  if (!rowCount) throw new AppError(404, 'Cita no encontrada');
  return { mensaje: 'Estado actualizado' };
}

export async function eliminar(id) {
  const rowCount = await migracionesRepo.eliminarCita(id);
  if (!rowCount) throw new AppError(404, 'Cita no encontrada');
  return { mensaje: 'Cita eliminada' };
}
