import { w } from '../middleware/auth.js';
import * as integracionesService from '../services/integraciones.service.js';

export const obtenerEstado = w(async (req, res) => {
  res.json(await integracionesService.obtenerEstado());
});
