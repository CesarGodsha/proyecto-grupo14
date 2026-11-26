import { w } from '../middleware/auth.js';
import * as authService from '../services/auth.service.js';

export const register = w(async (req, res) => {
  res.status(201).json(await authService.register(req.body || {}));
});

export const login = w(async (req, res) => {
  res.json(await authService.login(req.body || {}));
});
