import { Router } from 'express';
import { autenticar, requireRol, w } from '../middleware/auth.js';
import * as ctrl from '../controllers/gore.controller.js';

const r = Router();
r.use(autenticar, requireRol('gore'));

const staff = requireRol('gore', 'administrador', 'empleado');

r.get('/', w(ctrl.listar));
r.post('/', w(ctrl.crear));
r.put('/:id', w(ctrl.actualizar));
r.get('/todos', staff, w(ctrl.listar));
r.patch('/:id/estado', staff, w(ctrl.actualizar));
r.delete('/:id', requireRol('gore', 'administrador'), w(ctrl.eliminar));

export default r;
