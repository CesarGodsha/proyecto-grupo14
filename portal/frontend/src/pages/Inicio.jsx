import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const SERVICIOS = [
  {
    modulo: 'gore',
    nombre: 'Gobierno Regional de Junín',
    categoria: 'Mesa de partes y expedientes',
    descripcion:
      'Registra solicitudes y consulta el avance de tus expedientes regionales.',
    ruta: '/gore',
    accion: 'Abrir servicios GORE',
    monograma: 'GJ',
    imagen:
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80',
    altImagen: 'Paisaje andino de referencia para los servicios regionales',
    etiquetaImagen: 'Paisaje · imagen referencial',
  },
  {
    modulo: 'logistica',
    nombre: 'LogísticaMax Perú',
    categoria: 'Cotizaciones y despachos',
    descripcion:
      'Solicita una cotización, revisa permisos vinculados y sigue tus operaciones.',
    ruta: '/logistica',
    accion: 'Abrir LogísticaMax',
    monograma: 'LM',
    imagen:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    altImagen: 'Operaciones de almacenamiento y transporte de carga',
    etiquetaImagen: 'Operaciones · imagen ilustrativa',
  },
  {
    modulo: 'migraciones',
    nombre: 'Servicios Migratorios',
    categoria: 'Citas y orientación',
    descripcion:
      'Agenda y consulta citas del módulo, con enlaces a los canales oficiales.',
    ruta: '/migraciones',
    accion: 'Abrir servicios migratorios',
    monograma: 'MI',
    imagen:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
    altImagen: 'Avión en vuelo, imagen ilustrativa de viajes',
    etiquetaImagen: 'Viajes · imagen ilustrativa',
  },
];

const PASOS_PORTAL = [
  {
    numero: '01',
    titulo: 'Elige tu espacio',
    descripcion:
      'Abre el módulo que necesitas; los accesos disponibles dependen de tu rol.',
  },
  {
    numero: '02',
    titulo: 'Haz tu gestión',
    descripcion:
      'Registra solicitudes, revisa cotizaciones o consulta tus citas desde cada servicio.',
  },
  {
    numero: '03',
    titulo: 'Sigue el avance',
    descripcion:
      'Vuelve cuando quieras para revisar el estado de tus trámites y operaciones.',
  },
];

export default function Inicio() {
  const { usuario, rolDe } = useAuth();
  const serviciosDisponibles = SERVICIOS.filter(({ modulo }) => rolDe(modulo));

  return (
    <section className="portal-home">
      <header className="portal-home-hero">
        <div>
          <span className="portal-home-eyebrow">PORTAL UNIFICADO · JUNÍN</span>
          <h1>Hola, {usuario?.nombre || 'bienvenido'}</h1>
          <p>
            Accede a tus servicios de comercio exterior y atención regional desde
            un solo lugar.
          </p>
        </div>
        <div className="portal-home-summary" aria-label="Resumen de acceso">
          <strong>{serviciosDisponibles.length}</strong>
          <span>
            {serviciosDisponibles.length === 1
              ? 'servicio disponible'
              : 'servicios disponibles'}
          </span>
        </div>
      </header>

      <div className="portal-home-section-heading">
        <div>
          <span>ESPACIO DE TRABAJO</span>
          <h2>Tus servicios</h2>
        </div>
        <p>Elige un módulo para continuar con tus gestiones.</p>
      </div>

      {serviciosDisponibles.length ? (
        <div className="portal-service-grid">
          {serviciosDisponibles.map((servicio) => {
            const rol = rolDe(servicio.modulo);
            const esPersonal = rol === 'administrador' || rol === 'empleado';
            const esMigraciones = servicio.modulo === 'migraciones';
            const esLogistica = servicio.modulo === 'logistica';
            const ruta = esPersonal && esMigraciones
              ? '/migraciones/panel'
              : esPersonal && esLogistica
                ? '/logistica/panel'
                : servicio.ruta;
            const descripcion =
              esPersonal && esMigraciones
                ? 'Revisa las solicitudes recibidas y gestiona su atención desde la bandeja.'
                : esPersonal && esLogistica
                  ? 'Supervisa cotizaciones y despachos desde el panel operativo.'
                  : servicio.descripcion;
            const categoria =
              esPersonal && esMigraciones
                ? 'Atención de solicitudes'
                : servicio.categoria;
            const accion = esPersonal && esMigraciones
              ? 'Abrir bandeja de atención'
              : esPersonal && esLogistica
                ? 'Abrir panel operativo'
                : servicio.accion;

            return (
              <article
                className={`portal-service-card portal-service-card-${servicio.modulo}`}
                key={servicio.modulo}
              >
                <figure className="theme-photo portal-service-photo">
                  <img
                    src={servicio.imagen}
                    alt={servicio.altImagen}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <figcaption>{servicio.etiquetaImagen}</figcaption>
                </figure>
                <div className="portal-service-card-top">
                  <span className="portal-service-icon" aria-hidden="true">
                    {servicio.monograma}
                  </span>
                  <span className="portal-service-role">{rol}</span>
                </div>
                <span className="portal-service-category">
                  {categoria}
                </span>
                <h3>{servicio.nombre}</h3>
                <p>{descripcion}</p>
                <Link className="portal-service-link" to={ruta}>
                  {accion}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="portal-home-empty" role="status">
          No hay módulos asignados a esta cuenta. Solicita acceso al administrador
          del sistema.
        </div>
      )}

      <section className="portal-home-guide" aria-labelledby="portal-guide-title">
        <figure className="portal-home-guide-photo">
          <img
            src={SERVICIOS[0].imagen}
            alt="Paisaje andino de Junín"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <figcaption>Junín · tu espacio digital</figcaption>
        </figure>
        <div className="portal-home-guide-content">
          <span className="portal-home-guide-kicker">TU RUTA, EN TRES PASOS</span>
          <h2 id="portal-guide-title">Todo empieza con una buena ruta.</h2>
          <p>
            Un solo acceso para organizar tus gestiones. Elige un servicio y
            continúa desde donde lo dejaste.
          </p>
          <div className="portal-home-guide-steps">
            {PASOS_PORTAL.map((paso) => (
              <article key={paso.numero}>
                <span>{paso.numero}</span>
                <div>
                  <h3>{paso.titulo}</h3>
                  <p>{paso.descripcion}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="portal-home-note">
        <span className="portal-home-note-icon" aria-hidden="true">i</span>
        <p>
          Cada módulo conserva sus propios trámites y permisos. Tu sesión se
          comparte de forma segura entre los servicios habilitados para tu cuenta.
        </p>
      </footer>
    </section>
  );
}
