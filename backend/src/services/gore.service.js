import * as GoreModel from '../models/gore.model.js';
// CAPA SERVICE GORE: pasa directo al model (misma logica original)
export async function listar(query) { return GoreModel.list(query); }
export async function crear(body) { return GoreModel.create(body); }
export async function actualizar(id, body) {
  const row = await GoreModel.update(id, body);
  if (!row) { const e = new Error('Expediente no encontrado'); e.status = 404; throw e; }
  return row;
}
export async function eliminar(id) { await GoreModel.remove(id); return { mensaje: 'Expediente eliminado correctamente' }; }
