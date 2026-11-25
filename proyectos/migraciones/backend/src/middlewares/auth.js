import jwt from 'jsonwebtoken';

// Exige token vÃ¡lido (401 si no hay)
export function autenticar(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ mensaje: 'Inicia sesiÃ³n para continuar' });
  }
}

// Exige algÃºn rol en un mÃ³dulo (403 si no). Sin roles = cualquier rol del mÃ³dulo
export const requireRol = (modulo, ...roles) => (req, res, next) => {
  const ok = req.usuario.roles.some((r) => r.modulo === modulo && (!roles.length || roles.includes(r.rol)));
  ok ? next() : res.status(403).json({ mensaje: 'No tienes permiso en este mÃ³dulo' });
};

export const w = (fn) => (req, res, next) => fn(req, res, next).catch(next);
