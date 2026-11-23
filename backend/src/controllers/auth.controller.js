import * as AuthService from '../services/auth.service.js';
// CAPA CONTROLLER: solo req/res -> service
export async function register(req, res) {
  const result = await AuthService.register(req.body);
  res.status(201).json(result);
}
export async function login(req, res) {
  const result = await AuthService.login(req.body);
  res.json(result);
}
