import * as MigModel from '../models/migraciones.model.js';
// CAPA SERVICE MIGRACIONES
export const ESTADOS = ['registrado', 'confirmada', 'rechazado'];
export async function crear(id_usuario, { tramite, fecha, hora, id_cotizacion = null }) {
  if (!tramite || !fecha || !hora) { const e = new Error('Completa tramite, fecha y hora'); e.status = 400; throw e; }
  const row = await MigModel.create({ id_usuario, tramite, fecha, hora, id_cotizacion });
  return { id: row.id, codigo: 'MIG-' + String(row.id).padStart(5, '0') };
}
export async function mias(id_usuario) { return MigModel.findMine(id_usuario); }
export async function actualizar(id, id_usuario, body) {
  const rowCount = await MigModel.updateMine(id, id_usuario, body);
  if (!rowCount) { const e = new Error('No se puede modificar esta cita'); e.status = 404; throw e; }
  return { mensaje: 'Cita actualizada' };
}
export async function todas() { return MigModel.findAll(); }
export async function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) { const e = new Error('Estado no valido'); e.status = 400; throw e; }
  await MigModel.updateEstado(id, estado);
  return { mensaje: 'Estado actualizado' };
}
export async function eliminar(id) { await MigModel.remove(id); return { mensaje: 'Cita eliminada' }; }
