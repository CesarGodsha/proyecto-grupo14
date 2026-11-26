import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ModuleNavigation() {
  const { rolDe } = useAuth();
  const rol = rolDe('migraciones');
  const esPersonal = rol === 'administrador' || rol === 'empleado';
  const esCliente = rol === 'cliente';

  return (
    <nav className="module-nav" aria-label="Navegación de Migraciones">
      <NavLink className="module-nav-brand" to="/migraciones" end>
        <span className="module-nav-mark" aria-hidden="true">
          MI
        </span>
        <span>
          <strong>Servicios Migratorios</strong>
          <small>Portal de atención · Grupo 14</small>
        </span>
      </NavLink>
      <div className="module-nav-links">
        <NavLink to="/migraciones" end>Inicio</NavLink>
        {esCliente && <NavLink to="/migraciones/registro">Solicitar cita</NavLink>}
        {esCliente && <NavLink to="/migraciones/consulta">Consulta</NavLink>}
        {esPersonal && <NavLink to="/migraciones/panel">Bandeja</NavLink>}
      </div>
    </nav>
  );
}
