import { useEffect, useRef } from 'react';

export default function FondoRedNeuronalAzul() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -1000, y: -1000 };
    const pulse = { x: 0, y: 0, radius: 0, active: false };
    let frameId = 0;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(76, Math.max(34, Math.round((width * height) / 19000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        phase: Math.random() * Math.PI * 2,
        radius: 1.1 + Math.random() * 1.5,
      }));
    };

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const onClick = (event) => {
      pulse.x = event.clientX;
      pulse.y = event.clientY;
      pulse.radius = 0;
      pulse.active = true;
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 170 && distance > 0) {
          const force = (1 - distance / 170) * 0.012;
          particle.vx += dx * force;
          particle.vy += dy * force;
        }

        particle.vx *= 0.995;
        particle.vy *= 0.995;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -10 || particle.x > width + 10) particle.vx *= -1;
        if (particle.y < -10 || particle.y > height + 10) particle.vy *= -1;

        const glow = 0.5 + Math.sin(time / 900 + particle.phase) * 0.22;
        context.beginPath();
        context.fillStyle = `rgba(125, 211, 252, ${glow})`;
        context.shadowBlur = 12;
        context.shadowColor = '#38bdf8';
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > 128) continue;
          const alpha = (1 - distance / 128) * 0.22;
          context.beginPath();
          context.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          context.lineWidth = 0.7;
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      if (pulse.active) {
        pulse.radius += 4.2;
        const alpha = Math.max(0, 1 - pulse.radius / 240);
        context.beginPath();
        context.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.7})`;
        context.lineWidth = 1.5;
        context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        context.stroke();
        if (pulse.radius >= 240) pulse.active = false;
      }

      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('click', onClick);
    draw();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="gore-network-canvas" aria-hidden="true" />;
}
