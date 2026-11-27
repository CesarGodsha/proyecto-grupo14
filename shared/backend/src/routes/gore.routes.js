import { Router } from 'express';
import { autenticar, requireRol } from '../middleware/auth.js';
import { controlarTurno } from '../middleware/turnos.js';
import * as ctrl from '../controllers/gore.controller.js';
import crearRutasTurnos from './turnos.routes.js';

const router = Router();
router.use(autenticar, requireRol('gore'));
const staff = requireRol('gore', 'administrador', 'empleado');
router.use('/turnos', crearRutasTurnos('gore'));

router.get('/', controlarTurno('gore'), ctrl.listar);
router.post('/', controlarTurno('gore'), ctrl.crear);
router.put('/:id', staff, controlarTurno('gore'), ctrl.actualizar);
router.delete('/:id', requireRol('gore', 'administrador'), ctrl.eliminar);

export default router;