import { Link } from 'react-router-dom';
import useApiResource from '../../hooks/useApiResource.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PhotoCarousel from '../../components/PhotoCarousel.jsx';
import './migraciones.css';

const TRAMITES = [
  {
    nombre: 'Pasaporte',
    descripcion: 'Revisa la información y solicita una cita para este trámite.',
    codigo: 'PA',
    imagen:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80',
    altImagen: 'Avión en vuelo, imagen ilustrativa de viajes',
  },
  {
    nombre: 'Carné de extranjería',
    descripcion: 'Accede a la orientación y gestión de citas del módulo.',
    codigo: 'CE',
    imagen:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&q=80',
    altImagen: 'Pasaporte y mapa para planificar un viaje',
  },
  {
    nombre: 'Prórroga de permanencia',
    descripcion: 'Consulta las indicaciones oficiales antes de iniciar tu solicitud.',
    codigo: 'PR',
    imagen:
      'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=700&q=80',
    altImagen: 'Avión en una escena de viaje',
  },
];

const CANALES_OFICIALES = [
  {
    nombre: 'Portal de Migraciones en Gob.pe',
    href: 'https://www.gob.pe/migraciones',
  },
  {
    nombre: 'Agencia Digital Migraciones',
    href: 'https://agenciavirtual.migraciones.gob.pe/agencia-virtual/identidad',
  },
  {
    nombre: 'Citas para pasaporte',
    href: 'https://citaspasaporte.migraciones.gob.pe/citas-pasaporte-v2/',
  },
];

const MIG_CAROUSEL_SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85',
    alt: 'Avión en vuelo sobre las nubes',
    eyebrow: 'SERVICIOS MIGRATORIOS',
    title: 'Prepara tu próximo viaje',
    description: 'Encuentra orientación para organizar tus trámites migratorios.',
    action: 'Solicitar una cita',
    to: '/migraciones/registro',
  },
  {
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=85',
    alt: 'Pasaporte y mapa para planificar un viaje',
    eyebrow: 'ORIENTACIÓN Y TRÁMITES',
    title: 'Información clara para avanzar',
    description: 'Revisa las opciones disponibles y continúa con tu solicitud.',
    action: 'Ver trámites',
    to: '/migraciones/registro',
  },
  {
    image:
      'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1400&q=85',
    alt: 'Avión de pasajeros durante un viaje',
    eyebrow: 'ATENCIÓN EN LÍNEA',
    title: 'Consulta tus citas fácilmente',
    description: 'Mantén tus registros a la mano y revisa su estado.',
    action: 'Consultar mis citas',
    to: '/migraciones/consulta',
  },
];

const MIG_PERSONAL_SLIDE_COPY = [
  {
    eyebrow: 'GESTIÓN DE MIGRACIONES',
    title: 'Atención de solicitudes',
    description: 'Revisa los registros recibidos desde la bandeja del equipo.',
  },
  {
    eyebrow: 'SEGUIMIENTO INTERNO',
    title: 'Organiza cada atención',
    description: 'Consulta y actualiza el estado de las solicitudes asignadas.',
  },
  {
    eyebrow: 'PANEL DE ATENCIÓN',
    title: 'Información en un solo lugar',
    description: 'Gestiona los registros del módulo desde el panel interno.',
  },
];

const MIG_PERSONAL_CAROUSEL_SLIDES = MIG_CAROUSEL_SLIDES.map(
  (slide, index) => ({
    ...slide,
    ...MIG_PERSONAL_SLIDE_COPY[index],
    action: null,
    to: null,
  })
);

export default function InicioMigraciones() {
  const { usuario, rolDe } = useAuth();
  const rol = rolDe('migraciones');
  const esPersonal = rol === 'administrador' || rol === 'empleado';
  const esCliente = rol === 'cliente';
  const { data: citas, cargando, error } = useApiResource(
    esCliente ? '/migraciones/citas/mias' : null
  );
  const confirmadas = citas.filter((cita) =>
    String(cita.estado || '').toLowerCase().includes('confirm')
  ).length;
  const valorResumen = error ? '—' : cargando ? '…' : String(citas.length);
  const valorConfirmadas = error ? '—' : cargando ? '…' : String(confirmadas);
  const slides = esCliente
    ? MIG_CAROUSEL_SLIDES
    : esPersonal
      ? MIG_PERSONAL_CAROUSEL_SLIDES
      : [];

  return (
    <div className="mig mig-home">
      <main className="mig-home-container">
        <section className="mig-home-hero">
          <span className="mig-home-flight-route" aria-hidden="true">✈</span>
          <div className="mig-home-hero-copy">
            <span className="mig-home-eyebrow">
              SERVICIOS MIGRATORIOS · PORTAL DE ATENCIÓN
            </span>
            <h1>
              {usuario?.nombre
                ? `Hola, ${usuario.nombre}`
                : esPersonal
                  ? 'Panel de atención migratoria'
                  : 'Tus gestiones migratorias, más claras'}
            </h1>
            <p>
              {esPersonal
                ? 'Revisa las solicitudes recibidas y gestiona su atención desde la bandeja del equipo.'
                : 'Consulta orientación, solicita una cita en este módulo y revisa el estado de tus registros desde un solo lugar.'}
            </p>
            <div className="mig-home-actions">
              {esCliente && (
                <>
                  <Link className="mig-home-primary" to="/migraciones/registro">
                    <span aria-hidden="true">+</span>
                    Solicitar una cita
                  </Link>
                  <Link className="mig-home-secondary" to="/migraciones/consulta">
                    Consultar mis citas
                    <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
              {esPersonal && (
                <Link className="mig-home-primary" to="/migraciones/panel">
                  Abrir panel de atención <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
          {esCliente && (
            <aside className="mig-home-summary" aria-label="Resumen de citas">
              <span className="mig-home-summary-label">MI ACTIVIDAD</span>
              <div className="mig-home-metric">
                <strong>{valorResumen}</strong>
                <span>citas registradas</span>
              </div>
              <div className="mig-home-metric mig-home-metric-secondary">
                <strong>{valorConfirmadas}</strong>
                <span>con estado confirmado</span>
              </div>
              {error && (
                <p className="mig-home-summary-error" role="status">
                  No se pudo cargar el resumen. Puedes revisar tus citas.
                </p>
              )}
            </aside>
          )}
          {esPersonal && (
            <aside className="mig-home-summary" aria-label="Acceso del personal">
              <span className="mig-home-summary-label">GESTIÓN INTERNA</span>
              <div className="mig-home-metric">
                <strong>Panel</strong>
                <span>Solicitudes recibidas</span>
              </div>
              <div className="mig-home-metric mig-home-metric-secondary">
                <strong>{rol}</strong>
                <span>Acceso autorizado</span>
              </div>
            </aside>
          )}
        </section>

        {slides.length > 0 && (
          <PhotoCarousel
            id="migraciones-home-carousel"
            label="Imágenes y orientación de Migraciones"
            className="mig-home-carousel"
            slides={slides}
          />
        )}

        {esCliente && (
          <section className="mig-home-section" aria-labelledby="mig-home-services">
            <div className="mig-home-section-heading">
              <div>
                <span>TRÁMITES DISPONIBLES</span>
                <h2 id="mig-home-services">¿Qué necesitas gestionar?</h2>
              </div>
              <a
                href="https://www.gob.pe/migraciones"
                target="_blank"
                rel="noreferrer"
              >
                Ver orientación oficial <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="mig-home-service-grid">
              {TRAMITES.map((tramite) => (
                <article className="mig-home-service-card" key={tramite.nombre}>
                  <figure className="theme-photo mig-home-service-photo">
                    <img
                      src={tramite.imagen}
                      alt={tramite.altImagen}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <figcaption>{tramite.nombre}</figcaption>
                  </figure>
                  <span className="mig-home-service-icon" aria-hidden="true">
                    {tramite.codigo}
                  </span>
                  <h3>{tramite.nombre}</h3>
                  <p>{tramite.descripcion}</p>
                  <Link
                    to={`/migraciones/registro?tramite=${encodeURIComponent(tramite.nombre)}`}
                  >
                    Continuar <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mig-home-lower-grid">
          <div className="mig-home-official">
            <div className="mig-home-section-heading">
              <div>
                <span>CANALES DE INFORMACIÓN</span>
                <h2>Fuentes oficiales</h2>
              </div>
            </div>
            <p>
              Verifica requisitos, costos y disponibilidad directamente con la
              Superintendencia Nacional de Migraciones.
            </p>
            <ul>
              {CANALES_OFICIALES.map((canal) => (
                <li key={canal.href}>
                  <a href={canal.href} target="_blank" rel="noreferrer">
                    {canal.nombre}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mig-home-next">
            <span className="mig-home-next-icon" aria-hidden="true">
              i
            </span>
            <div>
              <h2>Antes de continuar</h2>
              <p>
                {esPersonal
                  ? 'Accede a la bandeja de atención para gestionar los registros recibidos.'
                  : 'Este módulo registra solicitudes de prueba. No emite documentos ni reemplaza las citas o trámites del portal oficial.'}
              </p>
            </div>
          </div>
        </section>

        <footer className="mig-home-disclaimer">
          <strong>Portal de atención del proyecto Grupo 14.</strong> No es un
          sitio oficial de Migraciones Perú. Los enlaces oficiales se abren en
          una pestaña aparte.
        </footer>
      </main>
    </div>
  );
}
