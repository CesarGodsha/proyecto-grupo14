import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ModuleNavigation() {
  const { rolDe } = useAuth();
  const esPersonal = ['administrador', 'empleado'].includes(rolDe('gore'));

  return (
    <nav
      className="module-nav module-nav-gore"
      aria-label="Navegación de GORE Junín"
    >
      <NavLink className="module-nav-brand" to="/gore" end>
        <span className="module-nav-mark" aria-hidden="true">
          GJ
        </span>
        <span>
          <strong>GORE Junín</strong>
          <small>Mesa de Partes Virtual</small>
        </span>
      </NavLink>
      <div className="module-nav-links">
        <NavLink to="/gore" end>Inicio</NavLink>
        <NavLink to="/gore/registro">Registrar</NavLink>
        <NavLink to="/gore/consulta">
          {esPersonal ? 'Consultar expedientes' : 'Mis expedientes'}
        </NavLink>
        {esPersonal && <NavLink to="/gore/panel">Bandeja de atención</NavLink>}
      </div>
    </nav>
  );
}
