import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { w } from '../middleware/auth.js';

const r = Router();

// Registro: crea el usuario con rol cliente en los 3 módulos
r.post('/register', w(async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) return res.status(400).json({ mensaje: 'Completa nombre, correo y contraseña' });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING RETURNING id',
    [nombre, email, hash]
  );
  if (!rows.length) return res.status(409).json({ mensaje: 'Ese correo ya está registrado' });
  for (const m of ['logistica', 'gore', 'migraciones'])
    await pool.query("INSERT INTO usuario_rol (id_usuario, modulo, rol) VALUES ($1,$2,'cliente')", [rows[0].id, m]);
  res.status(201).json({ mensaje: 'Usuario creado' });
}));

// Login: devuelve token + usuario con sus roles
r.post('/login', w(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT id, nombre, password_hash FROM usuarios WHERE email = $1', [email]);
  if (!rows.length || !(await bcrypt.compare(password || '', rows[0].password_hash)))
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  const { rows: roles } = await pool.query('SELECT modulo, rol FROM usuario_rol WHERE id_usuario = $1', [rows[0].id]);
  const usuario = { id: rows[0].id, nombre: rows[0].nombre, roles };
  res.json({ token: jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '8h' }), usuario });
}));

export default r;
