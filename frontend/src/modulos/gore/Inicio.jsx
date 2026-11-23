import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RegistroGore from './RegistroGore';
import ConsultaGore from './ConsultaGore';
import PanelGore from './PanelGore';
import './gore.css';

export default function Inicio() {
  const { usuario, rolDe } = useAuth();
  const [recargarKey, setRecargarKey] = useState(0);
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
                {/* Escudo exterior */}
                <path
                  d="M50 6 L86 20 V50 C86 73 70 88 50 95 C30 88 14 73 14 50 V20 Z"
                  fill="rgba(2, 44, 34, 0.9)"
                  stroke="url(#oroGore)"
                  strokeWidth="3.5"
                />
                {/* Sol radiante andino */}
                <circle cx="50" cy="34" r="9" fill="url(#oroGore)" />
                {/* Nevado Huaytapallana / Cordillera Junín */}
                <path d="M22 64 L40 42 L52 55 L64 39 L78 64 Z" fill="#10b981" opacity="0.9" />
                <path d="M35 48 L40 42 L45 48 L40 46 Z" fill="#ffffff" />
                <path d="M59 45 L64 39 L69 45 L64 43 Z" fill="#ffffff" />
                {/* Cinta inferior */}
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

          {/* Tarjeta visual lateral derecha con vista de la Sierra Central / Junín */}
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
      </div>
    </div>
  );
}