import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// El menú muestra solo las apps y opciones que corresponden a los roles del usuario
export default function MenuRoles() {
  const { usuario, logout, rolDe } = useAuth();
  const rolMig = rolDe('migraciones');
  const esStaff = rolMig === 'administrador' || rolMig === 'empleado';

  return (
    <nav className="menu">
      <strong>Grupo 14</strong>
      <NavLink to="/" end>Inicio</NavLink>
      {rolDe('logistica') && <NavLink to="/logistica">LogísticaMax <small>{rolDe('logistica')}</small></NavLink>}
      {rolDe('gore') && <NavLink to="/gore">GORE Junín <small>{rolDe('gore')}</small></NavLink>}
      {rolMig && !esStaff && <NavLink to="/migraciones/registro">Migraciones: nueva cita</NavLink>}
      {rolMig && !esStaff && <NavLink to="/migraciones/consulta">Migraciones: mis citas</NavLink>}
      {esStaff && <NavLink to="/migraciones/panel">Migraciones: panel <small>{rolMig}</small></NavLink>}
      <span className="espacio" />
      <span>{usuario.nombre}</span>
      <button onClick={logout}>Salir</button>
    </nav>
  );
}
