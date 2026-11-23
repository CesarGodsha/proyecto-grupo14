import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FondoAnimadoLogistica from '../modulos/logistica/FondoAnimadoLogistica.jsx';
import RutaCamionAnimado from '../modulos/logistica/RutaCamionAnimado.jsx';
import '../modulos/logistica/logistica.css';

const IMG_BANNER_URL =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';

const IMG_MINI_URL =
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80';

export default function Inicio() {
  const { usuario, rolDe } = useAuth();
  const rolLog = rolDe('logistica');
  const [imgBannerOk, setImgBannerOk] = useState(true);
  const [imgMiniOk, setImgMiniOk] = useState(true);

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

  const listaRoles = (
    Array.isArray(usuario.roles)
      ? usuario.roles.map((r) => [r.modulo, r.rol])
      : Object.entries(usuario.roles || {})
  ).map(([mod, rol], idx) => ({
    key: `${mod}-${idx}`,
    modulo: mod,
    rol: typeof rol === 'object' && rol !== null ? rol.rol : rol,
  }));

  const tieneMigraciones = listaRoles.some((item) => item.modulo === 'migraciones');

  return (
    <div className="inicio-fx-shell">
      <style>{`
        .inicio-fx-shell {
          position: relative;
          max-width: 820px;
          margin: 28px auto 44px;
          padding: 0 16px;
          overflow-x: clip;
        }

        .inicio-fx-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 42%),
            radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.14), transparent 45%),
            rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.24);
          box-shadow: 0 24px 55px rgba(0, 0, 0, 0.45);
          color: #f8fafc;
        }

        .inicio-fx-banner {
          position: relative;
          min-height: 150px;
          display: flex;
          align-items: flex-end;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.18);
          background: linear-gradient(125deg, #064e3b 0%, #0f172a 55%, #1e293b 100%);
          overflow: hidden;
        }

        .inicio-fx-banner-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.28;
          filter: saturate(1.15) contrast(1.08);
          transition: transform 0.7s ease;
        }

        .inicio-fx-card:hover .inicio-fx-banner-img {
          transform: scale(1.04);
        }

        .inicio-fx-banner-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          width: 100%;
          flex-wrap: wrap;
        }

        .inicio-fx-badge-foto {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.78);
          border: 1px solid rgba(251, 191, 36, 0.35);
          backdrop-filter: blur(8px);
        }

        .inicio-fx-mini-img {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          border: 1.5px solid #fbbf24;
          flex-shrink: 0;
        }

        .inicio-fx-avion {
          position: absolute;
          top: 18px;
          left: -90px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          animation: inicioVueloAvion 11s linear infinite;
        }

        .inicio-fx-estela {
          width: 54px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.75));
          border-radius: 999px;
        }

        @keyframes inicioVueloAvion {
          0% {
            transform: translateX(0) translateY(0) rotate(-4deg);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          50% {
            transform: translateX(420px) translateY(-8px) rotate(0deg);
            opacity: 0.95;
          }
          90% {
            opacity: 0.95;
          }
          100% {
            transform: translateX(920px) translateY(4px) rotate(3deg);
            opacity: 0;
          }
        }

        .inicio-fx-body {
          position: relative;
          z-index: 2;
          padding: 24px 26px 20px;
        }

        .inicio-fx-pista {
          position: relative;
          height: 40px;
          margin-top: 20px;
          border-top: 2px dashed rgba(148, 163, 184, 0.28);
          overflow: hidden;
          pointer-events: none;
        }

        .inicio-fx-camion {
          position: absolute;
          bottom: 4px;
          left: -100px;
          display: inline-flex;
          align-items: center;
          animation: inicioRutaCamion 14s linear infinite;
        }

        @keyframes inicioRutaCamion {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          8% {
            opacity: 0.95;
          }
          92% {
            opacity: 0.95;
          }
          100% {
            transform: translateX(940px);
            opacity: 0;
          }
        }

        @media (max-width: 700px) {
          .inicio-fx-body {
            padding: 18px 16px 16px;
          }

          .inicio-fx-banner {
            padding: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .inicio-fx-avion,
          .inicio-fx-camion {
            animation: none;
            display: none;
          }
        }
      `}</style>

      <div className="inicio-fx-card">
        <div className="inicio-fx-avion" aria-hidden="true">
          <span className="inicio-fx-estela" />
          <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
            <path
              d="M58 28L38 24L22 8H16L25 25L11 27L5 21H2L6 31L2 41H5L11 35L25 37L16 54H22L38 38L58 34C60.5 33.5 62 32.2 62 31C62 29.8 60.5 28.5 58 28Z"
              fill="#fbbf24"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="inicio-fx-banner">
          {imgBannerOk && (
            <img
              src={IMG_BANNER_URL}
              alt=""
              className="inicio-fx-banner-img"
              onError={() => setImgBannerOk(false)}
            />
          )}

          <div className="inicio-fx-banner-content">
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#6ee7b7',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  marginBottom: '10px',
                }}
              >
                Sesión activa · Grupo 14
              </span>
              <h1 style={{ margin: '0 0 4px', fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>
                Hola, {usuario.nombre}
              </h1>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.92rem' }}>
                Comercio Exterior Junín · Control y seguimiento integrado
              </p>
            </div>

            <div className="inicio-fx-badge-foto">
              {imgMiniOk ? (
                <img
                  src={IMG_MINI_URL}
                  alt="Operación"
                  className="inicio-fx-mini-img"
                  onError={() => setImgMiniOk(false)}
                />
              ) : (
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(56, 189, 248, 0.16)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    fontSize: '1.25rem',
                  }}
                >
                  🧭
                </div>
              )}
              <div style={{ fontSize: '0.8rem', lineHeight: 1.25 }}>
                <div style={{ fontWeight: 700, color: '#fde68a' }}>Red Operativa</div>
                <div style={{ color: '#94a3b8' }}>Carga · GORE · Frontera</div>
              </div>
            </div>
          </div>
        </div>

        <div className="inicio-fx-body">
          <p style={{ margin: '0 0 14px', color: '#94a3b8', fontSize: '0.96rem' }}>
            Tus roles asignados en este sistema:
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 22px',
              display: 'grid',
              gap: '12px',
            }}
          >
            {listaRoles.map((item) => (
              <li
                key={item.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.85)',
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                }}
              >
                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#e2e8f0' }}>
                  {item.modulo}
                </span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: 'rgba(59, 130, 246, 0.16)',
                    color: '#93c5fd',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                    textTransform: 'capitalize',
                  }}
                >
                  {item.rol}
                </span>
              </li>
            ))}
          </ul>

          {tieneMigraciones && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/migraciones/panel"
                style={{
                  display: 'inline-block',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Ir al Panel de Migraciones
              </Link>
            </div>
          )}

          <div className="inicio-fx-pista" aria-hidden="true">
            <div className="inicio-fx-camion">
              <svg width="74" height="34" viewBox="0 0 96 44" fill="none">
                <rect
                  x="6"
                  y="8"
                  width="52"
                  height="22"
                  rx="4"
                  fill="#1e293b"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <path
                  d="M58 14H76L84 22V30H58V14Z"
                  fill="#059669"
                  stroke="#a7f3d0"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="33" r="6" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2.5" />
                <circle cx="72" cy="33" r="6" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}