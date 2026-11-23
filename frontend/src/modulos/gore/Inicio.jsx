import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RegistroGore from './RegistroGore';
import ConsultaGore from './ConsultaGore';
import PanelGore from './PanelGore';
import './gore.css';

export default function Inicio() {
  const { usuario } = useAuth();
  const [pestana, setPestana] = useState('panel');
  const [recargarKey, setRecargarKey] = useState(0);
  const canvasRef = useRef(null);

  const rolGore =
    usuario?.roles?.find((r) => r.modulo === 'gore')?.rol || 'administrador';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const ajustarTamano = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano);

    const particulas = Array.from({ length: 42 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.4 + 0.8,
      dx: (Math.random() - 0.5) * 0.45,
      dy: (Math.random() - 0.5) * 0.45,
      color: Math.random() > 0.45 ? 'rgba(52, 211, 153, 0.55)' : 'rgba(251, 191, 36, 0.55)'
    }));

    const dibujar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particulas.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      animId = requestAnimationFrame(dibujar);
    };
    dibujar();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', ajustarTamano);
    };
  }, []);

  return (
    <div className="gore-wrapper">
      <canvas ref={canvasRef} className="gore-canvas" />

      <div className="gore-content">
        <header className="gore-header" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <img
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=250&q=80"
            alt="GORE Junín"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2px solid #fbbf24'
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/100x100/064e3b/fbbf24?text=GORE';
            }}
          />
          <div>
            <span className="gore-kicker">Portal Institucional • Región Junín</span>
            <h1>Gobierno Regional de Junín — Mesa de Partes Virtual</h1>
            <p className="gore-subtitle">
              Bienvenido, <strong>{usuario?.nombre || 'Admin GORE'}</strong> — Gestión Digital de Expedientes
            </p>
            <span className="gore-rol-pill">Rol GORE: {rolGore}</span>
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
          {(rolGore === 'administrador' || rolGore === 'empleado') && (
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
          {pestana === 'panel' && <PanelGore key={`p-${recargarKey}`} />}
        </main>
      </div>
    </div>
  );
}