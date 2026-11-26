import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepo from '../repositories/auth.repository.js';
import AppError from '../utils/AppError.js';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register({ nombre, email, password }) {
  const nombreNormalizado = String(nombre || '').trim();
  const emailNormalizado = String(email || '').trim().toLowerCase();
  const clave = String(password || '');

  if (!nombreNormalizado || !emailNormalizado || !clave) {
    throw new AppError(400, 'Completa nombre, correo y contraseña');
  }
  if (!EMAIL_VALIDO.test(emailNormalizado)) {
    throw new AppError(400, 'Ingresa un correo válido');
  }
  if (clave.length < 6) {
    throw new AppError(400, 'La contraseña debe tener al menos 6 caracteres');
  }

  const hash = await bcrypt.hash(clave, 10);
  const nuevoUsuario = await authRepo.crearUsuarioConRoles({
    nombre: nombreNormalizado,
    email: emailNormalizado,
    passwordHash: hash,
  });

  if (!nuevoUsuario) {
    throw new AppError(409, 'Ese correo ya está registrado');
  }

  return { mensaje: 'Usuario creado' };
}

export async function login({ email, password }) {
  const emailNormalizado = String(email || '').trim().toLowerCase();
  const clave = String(password || '');
  if (!emailNormalizado || !clave) {
    throw new AppError(400, 'Completa correo y contraseña');
  }

  const usuarioDb = await authRepo.buscarPorEmail(emailNormalizado);
  if (!usuarioDb || !(await bcrypt.compare(clave, usuarioDb.password_hash))) {
    throw new AppError(401, 'Correo o contraseña incorrectos');
  }

  const roles = await authRepo.obtenerRolesPorUsuario(usuarioDb.id);
  const usuario = { id: usuarioDb.id, nombre: usuarioDb.nombre, roles };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado');
  }

  return {
    token: jwt.sign(usuario, secret, { expiresIn: '8h' }),
    usuario,
  };
}
