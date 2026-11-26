import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function MenuRoles({ moduloActual }) {
  const { usuario, logout, rolDe } = useAuth();

  const rolLog = rolDe('logistica');
  const rolGore = rolDe('gore');
  const rolMig = rolDe('migraciones');
  const rolesUsuario = [
    rolLog && `Logística: ${rolLog}`,
    rolGore && `GORE: ${rolGore}`,
    rolMig && `Migraciones: ${rolMig}`,
  ].filter(Boolean).join(' · ');

  return (
    <nav className={`menu${moduloActual ? ' menu-compacta' : ''}`}>
      <strong className="marca-menu">Comercio Exterior Junín</strong>
      {moduloActual ? (
        <NavLink to="/" end>← Volver al portal</NavLink>
      ) : (
        <>
          <NavLink to="/" end>Inicio</NavLink>

          {rolGore && (
            <NavLink to="/gore">
              GORE Junín <small className="portal-nav-role">{rolGore}</small>
            </NavLink>
          )}
          {rolLog && (
            <NavLink to="/logistica">
              LogísticaMax <small className="portal-nav-role">{rolLog}</small>
            </NavLink>
          )}
          {rolMig && (
            <NavLink to="/migraciones">
              Migraciones <small className="portal-nav-role">{rolMig}</small>
            </NavLink>
          )}
        </>
      )}

      <span className="espacio" />
      <span className="menu-usuario">
        <strong>{usuario.nombre}</strong>
        <small>{rolesUsuario}</small>
      </span>
      <button onClick={logout}>Salir</button>
    </nav>
  );
}