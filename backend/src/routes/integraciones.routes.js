import { Router } from 'express';
import { autenticar } from '../middleware/auth.js';

const r = Router();
r.use(autenticar);
r.get('/', (req, res) => res.json({ modulo: 'integraciones', mensaje: 'Pendiente: Wilder, Fernando y César' }));

export default r;
