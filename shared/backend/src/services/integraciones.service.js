import * as integracionesRepo from '../repositories/integraciones.repository.js';

export async function obtenerEstado() {
  return integracionesRepo.obtenerEstadoModulo();
}
