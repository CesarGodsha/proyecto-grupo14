import { Router } from 'express';
import { autenticar } from '../middlewares/auth.js';
import * as ctrl from '../controllers/integraciones.controller.js';

const r = Router();
r.use(autenticar);
r.get('/', ctrl.obtenerEstado);

export default r;