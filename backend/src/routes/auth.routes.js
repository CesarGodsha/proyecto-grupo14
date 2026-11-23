import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { w } from '../middleware/auth.js';

const r = Router();

// CAPA ROUTES: solo URLs, sin logica
r.post('/register', w(ctrl.register));
r.post('/login', w(ctrl.login));

export default r;
