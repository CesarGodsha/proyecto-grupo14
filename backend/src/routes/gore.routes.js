import { Router } from 'express';
import * as ctrl from '../controllers/gore.controller.js';
import { w } from '../middleware/auth.js';

const r = Router();

// CAPA ROUTES GORE: mismas URLs originales, sin SQL
r.get('/', w(ctrl.list));
r.post('/', w(ctrl.create));
r.put('/:id', w(ctrl.update));
r.delete('/:id', w(ctrl.remove));

export default r;
