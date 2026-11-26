import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function MenuRoles({ moduloActual }) {
  const { usuario, logout, rolDe } = useAuth();

  const rolLog = rolDe('logistica');
  const esStaffLog = rolLog === 'administrador' || rolLog === 'empleado';

  const rolMig = rolDe('migraciones');
  const esStaffMig = rolMig === 'administrador' || rolMig === 'empleado';

  return (
    <nav className={`menu${moduloActual ? ' menu-compacta' : ''}`}>
      <strong className="marca-menu">Comercio Exterior Junín</strong>
      {moduloActual ? (
        <NavLink to="/" end>← Volver al portal</NavLink>
      ) : (
        <>
          <NavLink to="/" end>Inicio</NavLink>

          {rolLog && <NavLink to="/logistica">LogísticaMax</NavLink>}
          {rolLog === 'cliente' && <NavLink to="/logistica/registro">Cotizar carga</NavLink>}
          {rolLog === 'cliente' && <NavLink to="/logistica/consulta">Mis viajes</NavLink>}
          {esStaffLog && <NavLink to="/logistica/panel">Operaciones <small>{rolLog}</small></NavLink>}

          {rolDe('gore') && <NavLink to="/gore">GORE Junín <small>{rolDe('gore')}</small></NavLink>}

          {rolMig && <NavLink to="/migraciones">Migraciones</NavLink>}
          {rolMig === 'cliente' && <NavLink to="/migraciones/registro">Reservar cita</NavLink>}
          {rolMig === 'cliente' && <NavLink to="/migraciones/consulta">Consulta</NavLink>}
          {esStaffMig && <NavLink to="/migraciones/panel">Atención <small>{rolMig}</small></NavLink>}
        </>
      )}

      <span className="espacio" />
      <span>{usuario.nombre}</span>
      <button onClick={logout}>Salir</button>
    </nav>
  );
}