import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import useApiResource from '../../hooks/useApiResource.js';
import PhotoCarousel from '../../components/PhotoCarousel.jsx';
import './logistica.css';

const LOG_CAROUSEL_SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=85',
    alt: 'Camión de carga recorriendo una ruta logística',
    eyebrow: 'LOGÍSTICAMAX · RUTAS',
    title: 'Tu carga, siempre en movimiento',
    description: 'Organiza cada operación desde la cotización hasta el despacho.',
    action: 'Consultar operaciones',
    to: '/logistica/consulta',
  },
  {
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
    alt: 'Almacén logístico preparado para gestionar carga',
    eyebrow: 'CENTRO DE OPERACIONES',
    title: 'Un mejor control de tu carga',
    description: 'Revisa tus cotizaciones y mantén tus envíos bajo seguimiento.',
    action: 'Ver mis operaciones',
    to: '/logistica/consulta',
  },
  {
    image:
      'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=85',
    alt: 'Contenedores organizados para transporte de mercancías',
    eyebrow: 'GESTIÓN DE DESPACHOS',
    title: 'Conecta cada etapa del envío',
    description: 'Accede a las herramientas de logística desde un solo lugar.',
    action: 'Explorar servicios',
    to: '/logistica',
  },
];

const LOG_PERSONAL_SLIDE_COPY = [
  {
    eyebrow: 'LOGÍSTICAMAX · OPERACIONES',
    title: 'Control de despachos',
    description: 'Supervisa las operaciones activas desde el panel del equipo.',
  },
  {
    eyebrow: 'CENTRO DE OPERACIONES',
    title: 'Gestiona cada cotización',
    description: 'Revisa las solicitudes recibidas y sus permisos vinculados.',
  },
  {
    eyebrow: 'GESTIÓN DE DESPACHOS',
    title: 'Seguimiento centralizado',
    description: 'Actualiza el estado de las operaciones desde una sola bandeja.',
  },
];

const LOG_PERSONAL_CAROUSEL_SLIDES = LOG_CAROUSEL_SLIDES.map(
  (slide, index) => ({
    ...slide,
    ...LOG_PERSONAL_SLIDE_COPY[index],
    action: null,
    to: null,
  })
);

function formatoSoles(valor) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(valor);
}

export default function Inicio() {
  const { usuario, rolDe } = useAuth();
  const rol = rolDe('logistica');
  const esPersonal = rol === 'administrador' || rol === 'empleado';
  const esCliente = rol === 'cliente';
  const endpoint = esPersonal
    ? '/logistica/cotizaciones'
    : esCliente
      ? '/logistica/cotizaciones/mias'
      : null;
  const { data: cotizaciones, cargando, error, recargar } =
    useApiResource(endpoint);
  const enTransito = cotizaciones.filter(
    (cotizacion) => cotizacion.estado === 'en_transito'
  ).length;
  const montoCotizado = cotizaciones.reduce(
    (total, cotizacion) => total + Number(cotizacion.monto_calculado || 0),
    0
  );
  const resumen = (valor) => (error ? '—' : cargando ? '…' : valor);

  return (
    <main className="log-container log-home">
      <section className="log-home-hero">
        <div className="log-home-copy">
          <span className="log-home-eyebrow">
            LOGÍSTICAMAX PERÚ · {esPersonal ? 'CENTRO DE OPERACIONES' : 'PORTAL DE CLIENTES'}
          </span>
          <h1>
            {usuario?.nombre
              ? `Bienvenido, ${usuario.nombre}`
              : 'Gestiona tus operaciones de carga'}
          </h1>
          <p>
            {esPersonal
              ? 'Supervisa las cotizaciones y gestiona el estado de los despachos desde el panel operativo.'
              : 'Cotiza transporte, organiza permisos regionales y consulta el estado de cada despacho desde un mismo espacio.'}
          </p>
          <div className="log-home-actions">
            {esCliente && (
              <Link className="log-home-primary" to="/logistica/registro">
                <i className="bi bi-calculator" aria-hidden="true" />
                Cotizar una carga
              </Link>
            )}
            {esCliente && (
              <Link className="log-home-secondary" to="/logistica/consulta">
                Ver mis operaciones <span aria-hidden="true">→</span>
              </Link>
            )}
            {esPersonal && (
              <Link className="log-home-primary" to="/logistica/panel">
                Abrir panel operativo
              </Link>
            )}
          </div>
        </div>
        <div className="log-home-status">
          <PhotoCarousel
            id="logistica-home-carousel"
            label="Imágenes y servicios de LogísticaMax"
            className="log-home-carousel"
            slides={
              esPersonal ? LOG_PERSONAL_CAROUSEL_SLIDES : LOG_CAROUSEL_SLIDES
            }
          />
          <span className="log-home-status-icon" aria-hidden="true">
            LM
          </span>
          <strong>Seguimiento logístico</strong>
          <span>
            {error
              ? 'No se pudo consultar el servicio'
              : cargando
                ? 'Consultando operaciones…'
                : esPersonal
                  ? 'Cotizaciones y despachos del equipo'
                  : 'Tus cotizaciones y despachos'}
          </span>
          {error && (
            <button type="button" onClick={recargar}>
              Reintentar consulta
            </button>
          )}
        </div>
      </section>

      <section className="log-home-metrics" aria-label="Resumen de operaciones">
        <article className="log-home-metric">
          <span className="log-home-metric-icon" aria-hidden="true">
            01
          </span>
          <span>{esPersonal ? 'Total de cotizaciones' : 'Mis cotizaciones'}</span>
          <strong>{resumen(cotizaciones.length)}</strong>
        </article>
        <article className="log-home-metric">
          <span className="log-home-metric-icon" aria-hidden="true">
            02
          </span>
          <span>En tránsito</span>
          <strong>{resumen(enTransito)}</strong>
        </article>
        <article className="log-home-metric">
          <span className="log-home-metric-icon" aria-hidden="true">
            03
          </span>
          <span>Monto cotizado</span>
          <strong>{error ? '—' : cargando ? '…' : formatoSoles(montoCotizado)}</strong>
        </article>
      </section>

      {error && (
        <p className="log-home-error" role="alert">
          {error}
        </p>
      )}

      {esCliente && (
        <section className="log-home-section">
          <div className="log-home-section-heading">
            <div>
              <span>HERRAMIENTAS</span>
              <h2>¿Qué deseas hacer?</h2>
            </div>
          </div>
          <div className="log-home-tools">
            <Link className="log-home-tool" to="/logistica/registro">
              <figure className="theme-photo log-home-tool-photo">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=700&q=80"
                  alt="Camión de carga en una ruta"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <figcaption>Rutas de carga</figcaption>
              </figure>
              <span className="log-home-tool-number">01</span>
              <div>
                <h3>Solicitar cotización</h3>
                <p>
                  Calcula una tarifa estimada según ruta, peso y tipo de carga.
                </p>
              </div>
              <span className="log-home-tool-arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="log-home-tool" to="/logistica/consulta">
              <figure className="theme-photo log-home-tool-photo">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80"
                  alt="Centro de almacenamiento y distribución"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <figcaption>Seguimiento de operaciones</figcaption>
              </figure>
              <span className="log-home-tool-number">02</span>
              <div>
                <h3>Consultar operaciones</h3>
                <p>
                  Revisa estados, importes y permisos asociados a tus envíos.
                </p>
              </div>
              <span className="log-home-tool-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}

      <section className="log-home-flow" aria-label="Flujo de una operación">
        <div className="log-home-flow-heading">
          <span>FLUJO DE UNA OPERACIÓN</span>
          <h2>De la cotización al despacho</h2>
        </div>
        <div className="log-home-flow-steps">
          <div><span>1</span><strong>Cotización</strong><small>Define carga y ruta</small></div>
          <i aria-hidden="true">→</i>
          <div><span>2</span><strong>Permiso regional</strong><small>Vincula expediente GORE</small></div>
          <i aria-hidden="true">→</i>
          <div><span>3</span><strong>Control migratorio</strong><small>Asocia una cita, si aplica</small></div>
          <i aria-hidden="true">→</i>
          <div><span>4</span><strong>Seguimiento</strong><small>Consulta el estado</small></div>
        </div>
      </section>

      {!cargando && !error && cotizaciones.length > 0 && (
        <section className="log-home-recent">
          <div className="log-home-section-heading">
            <div>
              <span>ACTIVIDAD RECIENTE</span>
              <h2>Últimas cotizaciones</h2>
            </div>
            {esCliente && <Link to="/logistica/consulta">Ver todas →</Link>}
          </div>
          <div className="log-home-recent-list">
            {cotizaciones.slice(0, 3).map((cotizacion) => (
              <article key={cotizacion.id}>
                <span className="log-home-recent-code">{cotizacion.codigo}</span>
                <div>
                  <strong>{cotizacion.ruta}</strong>
                  <small>{cotizacion.carga} · {cotizacion.toneladas} t</small>
                </div>
                <span className={`log-home-state log-home-state-${cotizacion.estado}`}>
                  {String(cotizacion.estado || 'registrado').replaceAll('_', ' ')}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
