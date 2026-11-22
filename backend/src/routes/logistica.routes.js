import { Router } from 'express';
import { autenticar } from '../middleware/auth.js';

const r = Router();
r.use(autenticar);
r.get('/', (req, res) => res.json({ modulo: 'logistica', mensaje: 'Pendiente: Wilder' }));

export default r;
