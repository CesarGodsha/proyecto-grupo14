import * as integracionesRepo from '../repositories/integraciones.repository.js';

export const obtenerEstado = async (req, res) => {
  const estado = await integracionesRepo.obtenerEstadoModulo();
  res.json(estado);
};