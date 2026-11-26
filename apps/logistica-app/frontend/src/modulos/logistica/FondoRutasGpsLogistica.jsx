import { useEffect, useRef } from 'react';

const RUTAS = [
  { origen: [0.09, 0.38], control: [0.34, 0.05], destino: [0.58, 0.34], phase: 0 },
  { origen: [0.58, 0.34], control: [0.76, 0.7], destino: [0.91, 0.27], phase: 0.38 },
  { origen: [0.17, 0.78], control: [0.46, 0.56], destino: [0.76, 0.73], phase: 0.7 },
];

export default function FondoRutasGpsLogistica() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const point = ([x, y]) => [x * width, y * height];

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      RUTAS.forEach((route) => {
        const [startX, startY] = point(route.origen);
        const [controlX, controlY] = point(route.control);
        const [endX, endY] = point(route.destino);

        context.beginPath();
        context.moveTo(startX, startY);
        context.quadraticCurveTo(controlX, controlY, endX, endY);
        context.setLineDash([4, 12]);
        context.lineDashOffset = -time * 0.012;
        context.strokeStyle = 'rgba(251, 146, 60, 0.25)';
        context.lineWidth = 1.4;
        context.stroke();
        context.setLineDash([]);

        [[startX, startY], [endX, endY]].forEach(([x, y]) => {
          context.beginPath();
          context.fillStyle = 'rgba(251, 191, 36, 0.56)';
          context.shadowBlur = 13;
          context.shadowColor = '#f59e0b';
          context.arc(x, y, 2.4, 0, Math.PI * 2);
          context.fill();
        });

        const progress = (time * 0.00006 + route.phase) % 1;
        const inverse = 1 - progress;
        const vehicleX =
          inverse * inverse * startX +
          2 * inverse * progress * controlX +
          progress * progress * endX;
        const vehicleY =
          inverse * inverse * startY +
          2 * inverse * progress * controlY +
          progress * progress * endY;
        context.beginPath();
        context.fillStyle = '#fff7ed';
        context.shadowBlur = 18;
        context.shadowColor = '#fb923c';
        context.arc(vehicleX, vehicleY, 3.2, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

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

  return <canvas ref={canvasRef} className="log-routes-canvas" aria-hidden="true" />;
}
