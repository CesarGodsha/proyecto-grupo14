import { Router } from 'express';
import * as ctrl from '../controllers/gore.controller.js';

const r = Router();

// CAPA ROUTES GORE: mismas URLs originales, sin SQL
r.get('/', ctrl.list);
r.post('/', ctrl.create);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);

export default r;
