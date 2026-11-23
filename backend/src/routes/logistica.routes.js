import { Router } from 'express';
import * as ctrl from '../controllers/logistica.controller.js';
import { autenticar, requireRol, w } from '../middleware/auth.js';

const r = Router();
r.use(autenticar, requireRol('logistica'));

const staff = requireRol('logistica', 'administrador', 'empleado');

// CAPA ROUTES: mismas URLs y middlewares originales, sin logica
r.post('/cotizaciones', w(ctrl.crear));
r.get('/cotizaciones/mias', w(ctrl.mias));
r.get('/permisos-gore', w(ctrl.permisos));
r.put('/cotizaciones/:id', w(ctrl.actualizar));
r.get('/cotizaciones', staff, w(ctrl.todas));
r.patch('/cotizaciones/:id/estado', staff, w(ctrl.cambiarEstado));
r.delete('/cotizaciones/:id', requireRol('logistica', 'administrador'), w(ctrl.eliminar));

export default r;
