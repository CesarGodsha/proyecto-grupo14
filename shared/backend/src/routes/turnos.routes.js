import { Router } from 'express';
import * as ctrl from '../controllers/turnos.controller.js';
import { requireRol } from '../middleware/auth.js';

export default function crearRutasTurnos(modulo) {
  const router = Router();
  router.use(requireRol(modulo, 'administrador'));
  router.get('/', ctrl.listar(modulo));
  router.put('/', ctrl.guardar(modulo));
  router.delete('/', ctrl.eliminar(modulo));
  return router;
}
