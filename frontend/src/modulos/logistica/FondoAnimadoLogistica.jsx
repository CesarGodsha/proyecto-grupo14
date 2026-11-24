import { useEffect, useRef } from 'react';

export default function FondoAnimadoLogistica() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId;

    const getW = () => Math.max(window.innerWidth || 1280, 300);
    const getH = () => Math.max(window.innerHeight || 720, 300);

    const ajustarTamano = () => {
      canvas.width = getW();
      canvas.height = getH();
    };
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano);

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => {
      mouse.x = Number.isFinite(e.clientX) ? e.clientX : -9999;
      mouse.y = Number.isFinite(e.clientY) ? e.clientY : -9999;
    };
    window.addEventListener('mousemove', onMove);

    const gotas = Array.from({ length: 85 }, () => ({
      x: Math.random() * getW(),
      y: Math.random() * getH(),
      len: 16 + Math.random() * 26,
      vel: 4 + Math.random() * 5,
      alpha: 0.14 + Math.random() * 0.28,
    }));

    const crearCometa = () => ({
      x: Math.random() * getW() * 1.3,
      y: -50 - Math.random() * 280,
      len: 120 + Math.random() * 150,
      velX: -(6 + Math.random() * 5),
      velY: 6 + Math.random() * 5,
      alpha: 0.6 + Math.random() * 0.4,
      grosor: 1.6 + Math.random() * 1.6,
    });
    const cometas = Array.from({ length: 7 }, crearCometa);

    const nodos = Array.from({ length: 42 }, () => ({
      x: Math.random() * getW(),
      y: Math.random() * getH(),
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      r: 1.6 + Math.random() * 1.8,
    }));

    const dibujar = () => {
      const w = canvas.width || getW();
      const h = canvas.height || getH();
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < gotas.length; i++) {
        const g = gotas[i];
        const y2 = g.y + g.len;
        if (Number.isFinite(g.x) && Number.isFinite(g.y) && Number.isFinite(y2)) {
          const grad = ctx.createLinearGradient(g.x, g.y, g.x, y2);
          grad.addColorStop(0, 'rgba(59, 130, 246, 0)');
          grad.addColorStop(1, `rgba(96, 165, 250, ${g.alpha})`);
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.moveTo(g.x, g.y);
          ctx.lineTo(g.x, y2);
          ctx.stroke();
        }
        g.y += g.vel;
        if (g.y > h) {
          g.y = -g.len;
          g.x = Math.random() * w;
        }
      }

      for (let i = 0; i < cometas.length; i++) {
        const c = cometas[i];
        const tailX = c.x - c.velX * (c.len / 8);
        const tailY = c.y - c.velY * (c.len / 8);

        if (
          Number.isFinite(c.x) &&
          Number.isFinite(c.y) &&
          Number.isFinite(tailX) &&
          Number.isFinite(tailY)
        ) {
          const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
          grad.addColorStop(0, `rgba(219, 234, 254, ${c.alpha})`);
          grad.addColorStop(0.35, `rgba(59, 130, 246, ${c.alpha * 0.7})`);
          grad.addColorStop(1, 'rgba(37, 99, 235, 0)');

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = c.grosor;
          ctx.lineCap = 'round';
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = `rgba(239, 246, 255, ${c.alpha})`;
          ctx.arc(c.x, c.y, c.grosor + 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        c.x += c.velX;
        c.y += c.velY;

        if (c.x < -220 || c.y > h + 220) {
          cometas[i] = crearCometa();
        }
      }

      for (let i = 0; i < nodos.length; i++) {
        const n = nodos[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(96, 165, 250, 0.38)';
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.4 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(dibujar);
    };

    dibujar();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', ajustarTamano);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="log-canvas-bg" aria-hidden="true" />;
}