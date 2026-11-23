import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RegistroGore from './RegistroGore';
import ConsultaGore from './ConsultaGore';
import PanelGore from './PanelGore';
import './gore.css';

const PANELES_LATERALES = {
  registro: {
    izquierda: [
      {
        titulo: 'Requisitos Digitales',
        subtitulo: 'Documentación clara y foliada',
        descripcion: 'Ten a la mano tu DNI o RUC y redacta el asunto detallando el área o gerencia destino.',
        etiqueta: 'Paso 1 • Preparación',
        imagen: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=650&q=80'
      },
      {
        titulo: 'Sede Central Huancayo',
        subtitulo: 'Jr. Loreto N° 363 — Junín',
        descripcion: 'Tu solicitud ingresa directamente al sistema de trámite documentario regional las 24 horas.',
        etiqueta: 'Mesa Virtual 24/7',
        imagen: 'https://imgs.search.brave.com/YzNeAICmd0UizPHDTR08JlR5s8woSRCmyXdRwF_6Ngc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2NkL1NlZGVfR29i/aWVybm9fUmVnaW9u/YWxfSnVuJUMzJUFE/bi5qcGc'
      }
    ],
    derecha: [
      {
        titulo: 'Derivación Inmediata',
        subtitulo: 'Gerencias y Direcciones',
        descripcion: 'Cada expediente registrado recibe un código único para su derivación y evaluación técnica.',
        etiqueta: 'Gestión Ágil',
        imagen: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=650&q=80'
      },
      {
        titulo: 'Conexión Intersectorial',
        subtitulo: 'GORE • Logística • Migraciones',
        descripcion: 'Sincronizado para validar autorizaciones de carga, transporte y gestión pública.',
        etiqueta: 'Portal Integrado',
        imagen: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=650&q=80'
      }
    ]
  },
  consulta: {
    izquierda: [
      {
        titulo: 'Búsqueda por Código',
        subtitulo: 'Trazabilidad en tiempo real',
        descripcion: 'Ingresa tu código de expediente para revisar el historial, fecha de ingreso y área asignada.',
        etiqueta: 'Consulta 24/7',
        imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=650&q=80'
      },
      {
        titulo: 'Estados del Trámite',
        subtitulo: 'Pendiente • En Proceso • Aprobado',
        descripcion: 'Visualiza al instante si tu expediente ya cuenta con conformidad o resolución emitida.',
        etiqueta: 'Transparencia',
        imagen: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=650&q=80'
      }
    ],
    derecha: []
  },
  panel: {
    izquierda: [
      {
        titulo: 'Control de Expedientes',
        subtitulo: 'Bandeja de Gerencia',
        descripcion: 'Revisa los trámites ingresados por los administrados y verifica su sustento.',
        etiqueta: 'Supervisión',
        imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=650&q=80'
      },
      {
        titulo: 'Sede Central Huancayo',
        subtitulo: 'Jr. Loreto N° 363 — Junín',
        descripcion: 'Gestión administrativa y control documentario de las gerencias regionales.',
        etiqueta: 'GORE Junín',
        imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=650&q=80'
      }
    ],
    derecha: []
  }
};

function TarjetaVisual({ item, idUnico, hoverId, setHoverId, alturaImagen = '118px' }) {
  const activa = hoverId === idUnico;
  return (
    <article
      onMouseEnter={() => setHoverId(idUnico)}
      onMouseLeave={() => setHoverId(null)}
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        background: activa
          ? 'linear-gradient(160deg, rgba(6, 78, 59, 0.92) 0%, rgba(2, 35, 27, 0.96) 100%)'
          : 'rgba(2, 32, 25, 0.78)',
        border: activa
          ? '1.5px solid rgba(251, 191, 36, 0.78)'
          : '1px solid rgba(52, 211, 153, 0.25)',
        backdropFilter: 'blur(12px)',
        boxShadow: activa
          ? '0 16px 32px rgba(0, 0, 0, 0.45), 0 0 18px rgba(251, 191, 36, 0.22)'
          : '0 10px 24px rgba(0, 0, 0, 0.28)',
        transform: activa ? 'translateY(-5px) scale(1.015)' : 'translateY(0) scale(1)',
        transition: 'all 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'relative', height: alturaImagen, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={item.imagen}
          alt={item.titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: activa ? 'scale(1.09)' : 'scale(1)',
            transition: 'transform 0.55s ease'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(2, 32, 25, 0.92) 0%, rgba(2, 32, 25, 0.12) 65%)'
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '9px',
            right: '9px',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            background: 'rgba(2, 24, 19, 0.86)',
            color: '#fbbf24',
            border: '1px solid rgba(251, 191, 36, 0.5)'
          }}
        >
          {item.etiqueta}
        </span>
      </div>

      <div style={{ padding: '0.9rem 1rem 1.05rem' }}>
        <h3 style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>
          {item.titulo}
        </h3>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '0.4rem' }}>
          {item.subtitulo}
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.45, color: '#d1fae5' }}>
          {item.descripcion}
        </p>
      </div>
    </article>
  );
}

export default function Inicio() {
  const { usuario, rolDe } = useAuth();
  const [recargarKey, setRecargarKey] = useState(0);
  const [hoverId, setHoverId] = useState(null);
  const canvasRef = useRef(null);

  const rolGore =
    (typeof rolDe === 'function' ? rolDe('gore') : null) ||
    (Array.isArray(usuario?.roles)
      ? usuario.roles.find((r) => r.modulo === 'gore')?.rol
      : usuario?.roles?.gore) ||
    'cliente';

  const esStaffGore = rolGore === 'administrador' || rolGore === 'empleado';

  const [pestana, setPestana] = useState(() => (esStaffGore ? 'panel' : 'registro'));

  useEffect(() => {
    if (!esStaffGore && pestana === 'panel') {
      setPestana('registro');
    } else if (esStaffGore && pestana === 'registro') {
      setPestana('panel');
    }
  }, [esStaffGore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const mouse = { x: null, y: null };

    const ajustarTamano = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano);

    const manejarMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const limpiarMouse = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', manejarMouse);
    window.addEventListener('mouseleave', limpiarMouse);

    const particulas = Array.from({ length: 58 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 1.1,
      dx: (Math.random() - 0.5) * 0.65,
      dy: (Math.random() - 0.5) * 0.65,
      esDorada: Math.random() > 0.55
    }));

    const dibujar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particulas.length; i++) {
        const p = particulas[i];
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        for (let j = i + 1; j < particulas.length; j++) {
          const p2 = particulas[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle =
              p.esDorada || p2.esDorada
                ? `rgba(251, 191, 36, ${(1 - dist / 130) * 0.22})`
                : `rgba(52, 211, 153, ${(1 - dist / 130) * 0.24})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (distMouse < 165) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(251, 191, 36, ${(1 - distMouse / 165) * 0.42})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.esDorada ? 'rgba(251, 191, 36, 0.78)' : 'rgba(52, 211, 153, 0.78)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.esDorada ? '#fbbf24' : '#34d399';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(dibujar);
    };
    dibujar();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', ajustarTamano);
      window.removeEventListener('mousemove', manejarMouse);
      window.removeEventListener('mouseleave', limpiarMouse);
    };
  }, []);

  const panelesActivos = PANELES_LATERALES[pestana] || PANELES_LATERALES.registro;

  return (
    <div className="gore-wrapper">
      <canvas ref={canvasRef} className="gore-canvas" />

      <div className="gore-content">
        <header
          className="gore-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            backgroundImage: `linear-gradient(120deg, rgba(4, 47, 36, 0.94) 0%, rgba(6, 78, 59, 0.86) 58%, rgba(2, 44, 34, 0.94) 100%), url("https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1400&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.35rem', flexWrap: 'wrap' }}>
            {/* Emblema Institucional GORE Junín */}
            <div
              className="gore-logo-img"
              style={{
                width: '86px',
                height: '86px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 30% 25%, #065f46 0%, #022c22 100%)',
                padding: '6px',
                flexShrink: 0
              }}
            >
              <svg viewBox="0 0 100 100" width="68" height="68" aria-label="Emblema GORE Junín">
                <defs>
                  <linearGradient id="oroGore" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 6 L86 20 V50 C86 73 70 88 50 95 C30 88 14 73 14 50 V20 Z"
                  fill="rgba(2, 44, 34, 0.9)"
                  stroke="url(#oroGore)"
                  strokeWidth="3.5"
                />
                <circle cx="50" cy="34" r="9" fill="url(#oroGore)" />
                <path d="M22 64 L40 42 L52 55 L64 39 L78 64 Z" fill="#10b981" opacity="0.9" />
                <path d="M35 48 L40 42 L45 48 L40 46 Z" fill="#ffffff" />
                <path d="M59 45 L64 39 L69 45 L64 43 Z" fill="#ffffff" />
                <rect x="23" y="65" width="54" height="14" rx="4" fill="url(#oroGore)" />
                <text
                  x="50"
                  y="75"
                  textAnchor="middle"
                  fill="#1c1917"
                  fontSize="10.5"
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.8"
                >
                  JUNÍN
                </text>
              </svg>
            </div>

            <div>
              <span className="gore-kicker">Portal Institucional • Región Junín — Perú</span>
              <h1>Gobierno Regional de Junín — Mesa de Partes Virtual</h1>
              <p className="gore-subtitle">
                Bienvenido, <strong>{usuario?.nombre || 'Usuario GORE'}</strong> — Gestión Digital de Expedientes
              </p>
              <span className="gore-rol-pill">Rol GORE: {rolGore}</span>
            </div>
          </div>

          {/* Tarjeta visual lateral derecha */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.65rem 0.95rem',
              borderRadius: '16px',
              background: 'rgba(2, 24, 19, 0.68)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <img
              src="https://imgs.search.brave.com/zg2mK9MEok5K6cilPcKzcbGGk5S2eh0fth7DqsXJwpg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vq/SnR4ME9WSm5zbTZV/OTNQWU5Gc2VfblpF/V2xWb1R3U0VJQ1ZJ/aXdVWmpJa2NvRjZv/Njk3d2I4X0ZDOXN4/ZE5RUENwWUhFdkFm/ODFqVnduQzhmOEtK/c1lFZ2VQRldsV21T/dVlOTlA2X0lkLTZM/a1diRGFLeWxFRExf/UmcwU0sxdFZ2N1NF/OFRoV0RwbkNUOFhr/bC1pZjlmTUtpenAz/NHhtWFZWQ3FmNHcx/Z2ctY1pyOGd2RzVB/dUlqdnF4ekpQL3Mx/NjAwMC1ydy9HUiUy/MEp1bmluLWxvZ28u/d2VicA"
              alt="Región Junín - Sierra Central"
              style={{
                width: '84px',
                height: '58px',
                borderRadius: '11px',
                objectFit: 'cover',
                border: '1.5px solid #34d399'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Sede Central • Huancayo
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                Trámite Documentario
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>
                Atención en Línea 24/7
              </div>
            </div>
          </div>
        </header>

        <nav className="gore-nav">
          <button
            type="button"
            className={`gore-tab ${pestana === 'registro' ? 'active' : ''}`}
            onClick={() => setPestana('registro')}
          >
            📝 Registrar Trámite
          </button>
          <button
            type="button"
            className={`gore-tab ${pestana === 'consulta' ? 'active' : ''}`}
            onClick={() => setPestana('consulta')}
          >
            🔍 Consultar Expediente
          </button>
          {esStaffGore && (
            <button
              type="button"
              className={`gore-tab ${pestana === 'panel' ? 'active' : ''}`}
              onClick={() => setPestana('panel')}
            >
              🛡️ Bandeja de Atención (Aprobar)
            </button>
          )}
        </nav>

        {/* DISTRIBUCIÓN DE CONTENIDO Y TARJETAS LATERALES */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.35rem',
            alignItems: 'flex-start'
          }}
        >
          {/* COLUMNA IZQUIERDA (2 TARJETAS APILADAS) */}
          <aside
            aria-label="Información lateral izquierda"
            style={{
              flex: '1 1 255px',
              maxWidth: '285px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {panelesActivos.izquierda.map((item, idx) => (
              <TarjetaVisual
                key={`${pestana}-izq-${idx}`}
                item={item}
                idUnico={`${pestana}-izq-${idx}`}
                hoverId={hoverId}
                setHoverId={setHoverId}
                alturaImagen="125px"
              />
            ))}
          </aside>

          {/* COLUMNA DERECHA: FORMULARIO/TABLA ARRIBA + TARJETAS INFERIORES SOLO SI EXISTEN */}
          <div
            style={{
              flex: '999 1 520px',
              minWidth: 'min(100%, 480px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <main>
              {pestana === 'registro' && (
                <RegistroGore
                  alRegistrar={() => {
                    setRecargarKey((k) => k + 1);
                    setPestana('consulta');
                  }}
                />
              )}
              {pestana === 'consulta' && <ConsultaGore key={`c-${recargarKey}`} />}
              {esStaffGore && pestana === 'panel' && <PanelGore key={`p-${recargarKey}`} />}
            </main>

            {panelesActivos.derecha.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {panelesActivos.derecha.map((item, idx) => (
                  <TarjetaVisual
                    key={`${pestana}-der-${idx}`}
                    item={item}
                    idUnico={`${pestana}-der-${idx}`}
                    hoverId={hoverId}
                    setHoverId={setHoverId}
                    alturaImagen="120px"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}