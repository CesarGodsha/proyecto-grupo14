import { Router } from 'express';
import { autenticar, requireRol } from '../middleware/auth.js';
import * as ctrl from '../controllers/logistica.controller.js';

const r = Router();
r.use(autenticar, requireRol('logistica'));

const staff = requireRol('logistica', 'administrador', 'empleado');

r.post('/cotizaciones', ctrl.crear);
r.get('/cotizaciones/mias', ctrl.listarMias);
r.get('/permisos-gore', ctrl.listarPermisosGore);
r.put('/cotizaciones/:id', ctrl.actualizar);
r.get('/cotizaciones', staff, ctrl.listarTodas);
r.patch('/cotizaciones/:id/estado', staff, ctrl.cambiarEstado);
r.delete('/cotizaciones/:id', requireRol('logistica', 'administrador'), ctrl.eliminar);

export default r;