import jwt from 'jsonwebtoken';

// Exige token válido (401 si no hay)
export function autenticar(req, res, next) {
  const authorization = req.headers.authorization || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ mensaje: 'Inicia sesión para continuar' });
  }

  try {
    req.usuario = jwt.verify(match[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Inicia sesión para continuar' });
  }
}

// Exige algún rol en un módulo (403 si no). Sin roles = cualquier rol del módulo
export const requireRol = (modulo, ...roles) => (req, res, next) => {
  const userRoles = Array.isArray(req.usuario?.roles) ? req.usuario.roles : [];
  const ok = userRoles.some(
    (r) =>
      r.modulo === modulo &&
      (!roles.length || roles.includes(r.rol))
  );
  return ok
    ? next()
    : res.status(403).json({ mensaje: 'No tienes permiso en este módulo' });
};

export const w = (fn) => (req, res, next) => fn(req, res, next).catch(next);
