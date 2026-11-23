import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FondoAnimadoLogistica from '../modulos/logistica/FondoAnimadoLogistica.jsx';
import RutaCamionAnimado from '../modulos/logistica/RutaCamionAnimado.jsx';
import '../modulos/logistica/logistica.css';

export default function Inicio() {
  const { usuario, rolDe } = useAuth();
  const rolLog = rolDe('logistica');

  if (rolLog) {
    const esStaff = rolLog === 'administrador' || rolLog === 'empleado';
    return (
      <div className="log-container">
        <FondoAnimadoLogistica />
        <div className="log-hero">
          <div>
            <h1>Bienvenido, {usuario.nombre}</h1>
            <p>Plataforma Integral de Transporte Internacional · LogísticaMax Perú (Rol: {rolLog})</p>
          </div>
          <div className="log-live-pill">
            <span className="log-dot" />
            <span>SISTEMA OPERATIVO</span>
          </div>
        </div>

        <RutaCamionAnimado />

        <div className="log-dash-cards">
          {!esStaff && (
            <Link to="/logistica/registro" className="log-dash-link">
              <div className="log-card">
                <span className="log-pill">COTIZADOR EN VIVO</span>
                <h2 style={{ margin: '14px 0 8px', color: '#fff' }}>Cotizar Nueva Carga</h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
                  Calcula tarifas al instante por tonelaje, recargo MATPEL (+20%) y vincula permisos del GORE Junín.
                </p>
              </div>
            </Link>
          )}

          <Link to="/logistica/consulta" className="log-dash-link">
            <div className="log-card">
              <span className="log-pill">SEGUIMIENTO</span>
              <h2 style={{ margin: '14px 0 8px', color: '#fff' }}>Mis Viajes y Despachos</h2>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
                Consulta el estado de tus cotizaciones, permisos regionales aprobados y citas de control migratorio.
              </p>
            </div>
          </Link>

          {esStaff && (
            <Link to="/logistica/panel" className="log-dash-link">
              <div className="log-card">
                <span className="log-pill">TORRE DE CONTROL</span>
                <h2 style={{ margin: '14px 0 8px', color: '#fff' }}>Panel Operativo</h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
                  Aprueba despachos verificando expedientes GORE (HU-14.2) y monitorea citas en frontera (HU-14.4).
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tarjeta">
      <h1>Hola, {usuario.nombre}</h1>
      <p>Tus roles en este sistema:</p>
      <ul>
        {(Array.isArray(usuario.roles)
          ? usuario.roles.map((r) => [r.modulo, r.rol])
          : Object.entries(usuario.roles || {})
        ).map(([mod, rol], idx) => (
          <li key={`${mod}-${idx}`}>
            <strong>{mod}</strong>: {typeof rol === 'object' && rol !== null ? rol.rol : rol}
          </li>
        ))}
      </ul>
    </div>
  );
}