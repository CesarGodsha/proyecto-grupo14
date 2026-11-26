import './migraciones.css';

const ESTRELLAS_FUGACES = [
  { top: '12%', left: '78%', delay: '0s', duracion: '5.5s' },
  { top: '28%', left: '92%', delay: '2.1s', duracion: '6.8s' },
  { top: '54%', left: '85%', delay: '4.3s', duracion: '5.9s' },
  { top: '18%', left: '58%', delay: '7.2s', duracion: '7.4s' },
];

const AVIONES_FONDO = [
  {
    top: '20%',
    size: '1.15rem',
    duracion: '22s',
    delay: '0s',
    sentido: 'derecha',
    opacidad: 0.34,
  },
  {
    top: '68%',
    size: '1.45rem',
    duracion: '28s',
    delay: '6s',
    sentido: 'izquierda',
    opacidad: 0.28,
  },
  {
    top: '44%',
    size: '0.95rem',
    duracion: '34s',
    delay: '12s',
    sentido: 'derecha',
    opacidad: 0.24,
  },
];

const WIDGETS_LATERALES = [
  {
    claseExtra: 'mig-widget-izq',
    icono: 'bi-globe-americas',
    titulo: 'Rutas & Fronteras',
    subtitulo: 'Control migratorio ágil',
  },
  {
    claseExtra: 'mig-widget-der',
    icono: 'bi-passport',
    titulo: 'Trámites en Línea',
    subtitulo: 'Reserva verificada',
  },
];

export default function FondoEstrellasMigraciones() {
  return (
    <div className="mig-cielo-animado" aria-hidden="true">
      <div className="mig-estrellas-capa mig-estrellas-lejanas" />
      <div className="mig-estrellas-capa mig-estrellas-cercanas" />

      {ESTRELLAS_FUGACES.map((estrella, idx) => (
        <span
          key={`fugaz-${idx}`}
          className="mig-estrella-fugaz"
          style={{
            top: estrella.top,
            left: estrella.left,
            animationDelay: estrella.delay,
            animationDuration: estrella.duracion,
          }}
        />
      ))}

      {AVIONES_FONDO.map((avion, idx) => (
        <span
          key={`avion-${idx}`}
          className={`mig-avion-fondo mig-avion-${avion.sentido}`}
          style={{
            top: avion.top,
            fontSize: avion.size,
            animationDuration: avion.duracion,
            animationDelay: avion.delay,
            '--mig-avion-opacidad': avion.opacidad,
          }}
        >
          <i className="bi bi-airplane-fill" />
        </span>
      ))}

      {WIDGETS_LATERALES.map((item, idx) => (
        <div
          key={`widget-${idx}`}
          className={`mig-widget-lateral ${item.claseExtra}`}
        >
          <div className="mig-widget-icono">
            <i className={`bi ${item.icono}`} />
          </div>
          <div className="mig-widget-texto">
            <strong>{item.titulo}</strong>
            <span>{item.subtitulo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}