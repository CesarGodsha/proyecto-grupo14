import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Sin sesión -> login. Con sesión pero sin el rol pedido en el módulo -> inicio
export default function RutaProtegida({ modulo, roles, children }) {
  const { usuario, rolDe } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (modulo) {
    const rol = rolDe(modulo);
    if (!rol || (roles && !roles.includes(rol))) return <Navigate to="/" replace />;
  }
  return children;
}
