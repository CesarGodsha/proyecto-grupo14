import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function MenuRoles() {
  const { usuario, logout, rolDe } = useAuth();

  const rolLog = rolDe('logistica');
  const esStaffLog = rolLog === 'administrador' || rolLog === 'empleado';

  const rolMig = rolDe('migraciones');
  const esStaffMig = rolMig === 'administrador' || rolMig === 'empleado';

  return (
    <nav className="menu">
      <strong className="marca-menu">Comercio Exterior Junín</strong>
      <NavLink to="/" end>Inicio</NavLink>

      {/* Opciones de LogísticaMax Perú según rol */}
      {rolLog && !esStaffLog && <NavLink to="/logistica/registro">Logística: cotizar carga</NavLink>}
      {rolLog && <NavLink to="/logistica/consulta">Logística: mis viajes</NavLink>}
      {esStaffLog && <NavLink to="/logistica/panel">Logística: panel <small>{rolLog}</small></NavLink>}

      {/* Opciones de GORE Junín */}
      {rolDe('gore') && <NavLink to="/gore">GORE Junín <small>{rolDe('gore')}</small></NavLink>}

      {/* Opciones de Migraciones Perú según rol */}
      {rolMig && !esStaffMig && <NavLink to="/migraciones/registro">Migraciones: nueva cita</NavLink>}
      {rolMig && <NavLink to="/migraciones/consulta">Migraciones: mis citas</NavLink>}
      {esStaffMig && <NavLink to="/migraciones/panel">Migraciones: panel <small>{rolMig}</small></NavLink>}

      <span className="espacio" />
      <span>{usuario.nombre}</span>
      <button onClick={logout}>Salir</button>
    </nav>
  );
}