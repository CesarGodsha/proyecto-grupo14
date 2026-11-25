import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { w } from '../middleware/auth.js';
import * as authRepo from '../repositories/auth.repository.js';

export const register = w(async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Completa nombre, correo y contraseña' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const hash = await bcrypt.hash(password, 10);

  const nuevoUsuario = await authRepo.crearUsuario(
    String(nombre).trim(),
    emailNormalizado,
    hash
  );

  if (!nuevoUsuario) {
    return res.status(409).json({ mensaje: 'Ese correo ya está registrado' });
  }

  await authRepo.asignarRolesIniciales(nuevoUsuario.id);
  res.status(201).json({ mensaje: 'Usuario creado' });
});

export const login = w(async (req, res) => {
  const { email, password } = req.body;
  const emailNormalizado = String(email || '').trim().toLowerCase();

  const usuarioDb = await authRepo.buscarPorEmail(emailNormalizado);
  if (!usuarioDb || !(await bcrypt.compare(password || '', usuarioDb.password_hash))) {
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }

  const roles = await authRepo.obtenerRolesPorUsuario(usuarioDb.id);
  const usuario = { id: usuarioDb.id, nombre: usuarioDb.nombre, roles };

  res.json({
    token: jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '8h' }),
    usuario,
  });
});