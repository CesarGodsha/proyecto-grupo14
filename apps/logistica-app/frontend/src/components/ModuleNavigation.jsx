import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ModuleNavigation() {
  const { rolDe } = useAuth();
  const rol = rolDe('logistica');
  const esPersonal = rol === 'administrador' || rol === 'empleado';
  const esCliente = rol === 'cliente';

  return (
    <nav className="module-nav" aria-label="Navegación de LogísticaMax">
      <NavLink className="module-nav-brand" to="/logistica" end>
        <span className="module-nav-mark" aria-hidden="true">
          LM
        </span>
        <span>
          <strong>LogísticaMax Perú</strong>
          <small>Operaciones de carga · Grupo 14</small>
        </span>
      </NavLink>
      <div className="module-nav-links">
        <NavLink to="/logistica" end>Inicio</NavLink>
        {esCliente && <NavLink to="/logistica/registro">Nueva Cotización</NavLink>}
        {(esCliente || esPersonal) && (
          <NavLink to="/logistica/consulta">Seguimiento y Flota</NavLink>
        )}
        {esPersonal && (
          <NavLink to="/logistica/panel">Panel Operativo</NavLink>
        )}
      </div>
    </nav>
  );
}
