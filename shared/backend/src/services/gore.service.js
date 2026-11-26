import * as goreRepo from '../repositories/gore.repository.js';
import AppError from '../utils/AppError.js';

const ESTADOS = ['registrado', 'atendido', 'observado'];

export async function listar({ usuario, estado, q }) {
  const esStaff = usuario.roles.some(
    ({ modulo, rol }) =>
      modulo === 'gore' && ['administrador', 'empleado'].includes(rol)
  );
  return goreRepo.listarTramites({
    estado,
    q,
    idUsuario: esStaff ? null : usuario.id,
  });
}

export async function crear({ usuario, asunto, documento }) {
  const asuntoLimpio = String(asunto || '').trim();
  if (!asuntoLimpio) {
    throw new AppError(400, 'Completa el asunto del trámite');
  }
  return goreRepo.crearTramite(
    usuario.id,
    asuntoLimpio,
    String(documento || '').trim() || 'solicitud.pdf'
  );
}

export async function actualizar(id, cambios) {
  if (cambios.estado && !ESTADOS.includes(cambios.estado)) {
    throw new AppError(400, 'Estado de expediente no válido');
  }
  const actualizado = await goreRepo.actualizarTramite(id, cambios);
  if (!actualizado) {
    throw new AppError(404, 'Expediente no encontrado');
  }
  return actualizado;
}

export async function eliminar(id) {
  const eliminado = await goreRepo.eliminarTramite(id);
  if (!eliminado) {
    throw new AppError(404, 'Expediente no encontrado');
  }
}
