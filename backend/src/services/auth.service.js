import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.model.js';

// CAPA SERVICE AUTH: logica de negocio, sin req/res
export async function register({ nombre, email, password }) {
  if (!nombre || !email || !password) {
    const e = new Error('Completa nombre, correo y contrasena');
    e.status = 400;
    throw e;
  }
  const emailNorm = String(email).trim().toLowerCase();
  const hash = await bcrypt.hash(password, 10);
  const created = await UserModel.createUser(String(nombre).trim(), emailNorm, hash);
  if (!created) {
    const e = new Error('Ese correo ya esta registrado');
    e.status = 409;
    throw e;
  }
  await UserModel.assignDefaultRoles(created.id);
  return { mensaje: 'Usuario creado' };
}

export async function login({ email, password }) {
  const emailNorm = String(email || '').trim().toLowerCase();
  const user = await UserModel.findByEmail(emailNorm);
  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
    const e = new Error('Correo o contrasena incorrectos');
    e.status = 401;
    throw e;
  }
  const roles = await UserModel.getRoles(user.id);
  const usuario = { id: user.id, nombre: user.nombre, roles };
  const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '8h' });
  return { token, usuario };
}
