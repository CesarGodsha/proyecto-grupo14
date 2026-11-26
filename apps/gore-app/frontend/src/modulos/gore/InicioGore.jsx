import { Link } from 'react-router-dom';
import IconoGore from '../../components/IconoGore.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const SERVICIOS_BASE = [
  {
    ruta: '/gore/registro',
    etiqueta: 'MESA DE PARTES',
    titulo: 'Registrar expediente',
    descripcion:
      'Presenta una solicitud y conserva el registro de tu trámite regional.',
    imagen:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    alt: 'Documentos preparados para una solicitud administrativa',
    icono: 'archivo',
  },
  {
    ruta: '/gore/consulta',
    etiqueta: 'SEGUIMIENTO',
    titulo: 'Consultar expediente',
    descripcion:
      'Revisa los estados y detalles de tus solicitudes registradas.',
    imagen:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    alt: 'Panel digital para consultar información',
    icono: 'buscar',
  },
];

export default function InicioGore() {
  const { usuario, rolDe } = useAuth();
  const rolGore = rolDe('gore') || 'cliente';
  const esPersonal = ['administrador', 'empleado'].includes(rolGore);
  const servicios = esPersonal
    ? [
        ...SERVICIOS_BASE,
        {
          ruta: '/gore/panel',
          etiqueta: 'GESTIÓN INTERNA',
          titulo: 'Bandeja de atención',
          descripcion:
            'Revisa expedientes recibidos y actualiza su estado de atención.',
          imagen:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          alt: 'Panel de datos para controlar expedientes',
          icono: 'bandeja',
        },
      ]
    : SERVICIOS_BASE;

  return (
    <main className="gore-home">
      <section className="gore-home-hero">
        <div className="gore-home-copy">
          <span className="gore-home-eyebrow">
            ATENCIÓN DIGITAL · GOBIERNO REGIONAL DE JUNÍN
          </span>
          <h2>Tu gestión regional, desde un solo lugar</h2>
          <p>
            Hola, <strong>{usuario?.nombre || 'usuario'}</strong>. Presenta una
            solicitud, consulta tus expedientes o ingresa a las herramientas de
            atención según tu rol.
          </p>
          <div className="gore-home-actions">
            <Link className="gore-link-button" to="/gore/registro">
              Registrar solicitud <span aria-hidden="true">→</span>
            </Link>
            <Link className="gore-link-secondary" to="/gore/consulta">
              Consultar expediente
            </Link>
          </div>
          <div className="gore-home-session">
            <span className="gore-home-session-icon" aria-hidden="true">
              <IconoGore nombre="seguridad" />
            </span>
            <span>
              <strong>Sesión compartida segura</strong>
              <small>Acceso habilitado para {rolGore}</small>
            </span>
          </div>
        </div>
        <figure className="theme-photo gore-home-photo">
          <img
            src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=85"
            alt="Paisaje andino de la región central del Perú"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <figcaption>Junín · imagen referencial</figcaption>
        </figure>
      </section>

      <section className="gore-home-services" aria-labelledby="gore-services-title">
        <header className="gore-home-section-heading">
          <div>
            <span>SERVICIOS DISPONIBLES</span>
            <h2 id="gore-services-title">Mesa de Partes Virtual</h2>
            <p>Selecciona una función para continuar.</p>
          </div>
          <span className="gore-home-role">
            <IconoGore nombre="persona" />
            {rolGore}
          </span>
        </header>

        <div className="gore-home-grid">
          {servicios.map((servicio) => (
            <Link
              className="gore-home-card"
              key={servicio.ruta}
              to={servicio.ruta}
            >
              <figure className="theme-photo gore-home-card-photo">
                <img
                  src={servicio.imagen}
                  alt={servicio.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </figure>
              <div className="gore-home-card-content">
                <span className="gore-home-card-icon" aria-hidden="true">
                  <IconoGore nombre={servicio.icono} />
                </span>
                <span className="gore-home-card-label">{servicio.etiqueta}</span>
                <h3>{servicio.titulo}</h3>
                <p>{servicio.descripcion}</p>
                <span className="gore-home-card-link">
                  Abrir servicio <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <aside className="gore-home-official">
        <span className="gore-home-official-mark" aria-hidden="true">
          <IconoGore nombre="informacion" />
        </span>
        <p>
          Consulta noticias, servicios y canales de atención regional en el
          portal institucional del GORE Junín.
        </p>
        <a
          href="https://www.regionjunin.gob.pe/"
          target="_blank"
          rel="noreferrer"
        >
          Portal institucional <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </main>
  );
}
