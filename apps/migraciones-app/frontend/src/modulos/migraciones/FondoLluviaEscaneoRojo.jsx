import { useEffect, useRef } from 'react';

export default function FondoLluviaEscaneoRojo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = 0;
    let width = 0;
    let height = 0;
    let beams = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      beams = Array.from({ length: 42 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 18 + Math.random() * 65,
        speed: 0.35 + Math.random() * 0.85,
        alpha: 0.12 + Math.random() * 0.35,
      }));
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      beams.forEach((beam) => {
        const gradient = context.createLinearGradient(
          beam.x,
          beam.y,
          beam.x + beam.length * 0.55,
          beam.y + beam.length
        );
        gradient.addColorStop(0, 'rgba(248, 250, 252, 0)');
        gradient.addColorStop(0.55, `rgba(248, 113, 113, ${beam.alpha})`);
        gradient.addColorStop(1, 'rgba(185, 28, 28, 0)');
        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = 1;
        context.moveTo(beam.x, beam.y);
        context.lineTo(beam.x + beam.length * 0.55, beam.y + beam.length);
        context.stroke();
        beam.x += beam.speed * 0.42;
        beam.y += beam.speed;
        if (beam.y > height + beam.length) {
          beam.y = -beam.length;
          beam.x = Math.random() * width;
        }
      });

      const scanY = ((time * 0.018) % (height + 180)) - 90;
      const scan = context.createLinearGradient(0, scanY - 38, 0, scanY + 38);
      scan.addColorStop(0, 'rgba(248, 113, 113, 0)');
      scan.addColorStop(0.5, 'rgba(248, 113, 113, 0.11)');
      scan.addColorStop(1, 'rgba(248, 113, 113, 0)');
      context.fillStyle = scan;
      context.fillRect(0, scanY - 38, width, 76);
      context.beginPath();
      context.strokeStyle = 'rgba(254, 202, 202, 0.12)';
      context.lineWidth = 1;
      context.moveTo(0, scanY);
      context.lineTo(width, scanY);
      context.stroke();

      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="mig-scan-canvas" aria-hidden="true" />;
}
