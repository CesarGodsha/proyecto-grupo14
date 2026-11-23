import { Router } from 'express';
import * as ctrl from '../controllers/migraciones.controller.js';
import { autenticar, requireRol, w } from '../middleware/auth.js';

const r = Router();
r.use(autenticar, requireRol('migraciones'));
const staff = requireRol('migraciones', 'administrador', 'empleado');

// CAPA ROUTES: mismas URLs originales
r.post('/citas', w(ctrl.crear));
r.get('/citas/mias', w(ctrl.mias));
r.put('/citas/:id', w(ctrl.actualizar));
r.get('/citas', staff, w(ctrl.todas));
r.patch('/citas/:id/estado', staff, w(ctrl.cambiarEstado));
r.delete('/citas/:id', requireRol('migraciones', 'administrador'), w(ctrl.eliminar));

export default r;
