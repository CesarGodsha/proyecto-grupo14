import jwt from 'jsonwebtoken';

// Exige token válido (401 si no hay)
export function autenticar(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ mensaje: 'Inicia sesión para continuar' });
  }
}

// Exige algún rol en un módulo (403 si no). Sin roles = cualquier rol del módulo
export const requireRol = (modulo, ...roles) => (req, res, next) => {
  const ok = req.usuario.roles.some((r) => r.modulo === modulo && (!roles.length || roles.includes(r.rol)));
  ok ? next() : res.status(403).json({ mensaje: 'No tienes permiso en este módulo' });
};

export const w = (fn) => (req, res, next) => fn(req, res, next).catch(next);
