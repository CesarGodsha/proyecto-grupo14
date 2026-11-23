import * as LogModel from '../models/logistica.model.js';

// CAPA SERVICE LOGISTICA: formula oficial Caso 35 + validaciones HU-14.2
export const ESTADOS = ['registrado', 'confirmada', 'en_transito', 'entregado', 'rechazado'];

export function calcularTarifa(toneladas, matpel) {
  const t = Math.max(0.1, Number(toneladas) || 1);
  const base = 450 + Math.max(0, t - 5) * 80;
  return Number((matpel ? base * 1.2 : base).toFixed(2));
}

export async function crearCotizacion({ id_usuario, nombreUsuario, cliente, ruta, carga, toneladas = 5, matpel = false, id_tramite = null }) {
  if (!ruta || !carga) {
    const e = new Error('Completa la ruta y descripcion de carga');
    e.status = 400;
    throw e;
  }
  const monto = calcularTarifa(toneladas, matpel);
  const nombreCliente = cliente || nombreUsuario;
  const tramiteId = id_tramite ? Number(id_tramite) : null;
  const row = await LogModel.create({
    id_usuario, cliente: nombreCliente, ruta, carga,
    toneladas: Number(toneladas), matpel: Boolean(matpel), monto, tramiteId
  });
  return { id: row.id, codigo: 'COT-' + String(row.id).padStart(5, '0'), monto_calculado: monto };
}

export async function misCotizaciones(id_usuario) {
  return LogModel.findMine(id_usuario);
}

export async function permisosPara(usuario) {
  const roles = Array.isArray(usuario?.roles) ? usuario.roles : [];
  const esStaff = roles.some((ri) => ri.modulo === 'logistica' && ['administrador', 'empleado'].includes(String(ri.rol).toLowerCase()));
  if (esStaff) return LogModel.findPermisosStaff();
  return LogModel.findPermisosMine(usuario.id);
}

export async function actualizarCotizacion(id, { cliente, ruta, carga, toneladas, matpel, id_tramite = null }) {
  const monto = calcularTarifa(toneladas, matpel);
  const tramiteId = id_tramite ? Number(id_tramite) : null;
  const rowCount = await LogModel.updateIfRegistrado(id, { cliente, ruta, carga, toneladas: Number(toneladas), matpel: Boolean(matpel), monto, tramiteId });
  if (!rowCount) {
    const e = new Error('Solo se pueden editar cotizaciones en estado registrado');
    e.status = 404;
    throw e;
  }
  return { mensaje: 'Cotizacion actualizada', monto_calculado: monto };
}

export async function todas() {
  return LogModel.findAll();
}

export async function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) {
    const e = new Error('Estado no valido');
    e.status = 400;
    throw e;
  }
  if (estado === 'confirmada') {
    const check = await LogModel.findTramiteCheck(id);
    if (!check) {
      const e = new Error('Cotizacion no encontrada');
      e.status = 404;
      throw e;
    }
    if (!check.id_tramite) {
      const e = new Error('No se puede confirmar: falta asociar un tramite de permiso del GORE.');
      e.status = 400;
      throw e;
    }
    if (check.estado_tramite !== 'atendido') {
      const e = new Error('No se puede confirmar: el permiso del GORE esta en estado "' + (check.estado_tramite || 'pendiente') + '" (debe estar "atendido").');
      e.status = 400;
      throw e;
    }
  }
  await LogModel.updateEstado(id, estado);
  return { mensaje: 'Estado actualizado a ' + estado };
}

export async function eliminar(id) {
  await LogModel.remove(id);
  return { mensaje: 'Cotizacion eliminada' };
}
