import * as repo from '../repositories/gore.repository.js';
// Service S13: controller -> service -> repository -> SQL $1,$2
export const listarMias = (...a) => repo.listarMisCotizaciones ? repo.listarMisCotizaciones(...a) : repo.listarTramites(...a);
export const listarTodas = (...a) => repo.listarTodas ? repo.listarTodas(...a) : repo.listarTramites(...a);
export const crear = (...a) => (repo.crearCotizacion||repo.crearTramite||repo.crear)(...a);
export const actualizar = (...a) => (repo.actualizarCotizacion||repo.actualizarTramite||repo.actualizar)(...a);
export const cambiarEstado = (...a) => (repo.cambiarEstado||repo.actualizarTramite)(...a);
export const eliminar = (...a) => (repo.eliminarCotizacion||repo.eliminarTramite||repo.eliminar)(...a);
