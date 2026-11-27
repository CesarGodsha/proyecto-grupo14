import { Router } from 'express';
import { autenticar, requireRol } from '../middleware/auth.js';
import { controlarTurno } from '../middleware/turnos.js';
import * as ctrl from '../controllers/logistica.controller.js';
import crearRutasTurnos from './turnos.routes.js';

const r = Router();
r.use(autenticar, requireRol('logistica'));

const cliente = requireRol('logistica', 'cliente');
const staff = requireRol('logistica', 'administrador', 'empleado');

r.post('/cotizaciones', cliente, ctrl.crear);
r.get('/cotizaciones/mias', cliente, ctrl.listarMias);
r.get('/permisos-gore', cliente, ctrl.listarPermisosGore);
r.put('/cotizaciones/:id', cliente, ctrl.actualizar);
r.get('/cotizaciones', staff, controlarTurno('logistica'), ctrl.listarTodas);
r.patch('/cotizaciones/:id/estado', staff, controlarTurno('logistica'), ctrl.cambiarEstado);
r.delete('/cotizaciones/:id', requireRol('logistica', 'administrador'), ctrl.eliminar);
r.use('/turnos', crearRutasTurnos('logistica'));

export default r;