import { Router } from 'express';
import { autenticar, requireRol } from '../middleware/auth.js';
import * as ctrl from '../controllers/migraciones.controller.js';

const r = Router();
r.use(autenticar, requireRol('migraciones'));
const cliente = requireRol('migraciones', 'cliente');
const staff = requireRol('migraciones', 'administrador', 'empleado');

r.post('/citas', cliente, ctrl.crear);
r.get('/citas/mias', cliente, ctrl.listarMias);
r.put('/citas/:id', cliente, ctrl.actualizar);
r.get('/citas', staff, ctrl.listarTodas);
r.patch('/citas/:id/estado', staff, ctrl.cambiarEstado);
r.delete('/citas/:id', requireRol('migraciones', 'administrador'), ctrl.eliminar);

export default r;