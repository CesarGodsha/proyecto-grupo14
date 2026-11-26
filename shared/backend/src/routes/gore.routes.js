import { Router } from 'express';
import { autenticar, requireRol } from '../middleware/auth.js';
import * as ctrl from '../controllers/gore.controller.js';

const router = Router();
router.use(autenticar, requireRol('gore'));
const staff = requireRol('gore', 'administrador', 'empleado');

router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
router.put('/:id', staff, ctrl.actualizar);
router.delete('/:id', requireRol('gore', 'administrador'), ctrl.eliminar);

export default router;