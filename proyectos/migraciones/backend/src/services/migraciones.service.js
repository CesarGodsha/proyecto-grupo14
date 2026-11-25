import * as repo from '../repositories/migraciones.repository.js';
export const listarMias = (idUsuario) => repo.listarMisCitas(idUsuario);
export const listarTodas = () => repo.listarTodas();
export const crear = (d) => repo.crearCita(d);
export const actualizar = (id, d, uid, esStaff) => repo.actualizarCita(id, d, uid, esStaff);
export const cambiarEstado = (id, estado) => repo.cambiarEstado(id, estado);
export const eliminar = (id) => repo.eliminarCita(id);
