import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Estado from '../../components/Estado.jsx';
import RutaCamionAnimado from './RutaCamionAnimado.jsx';
import './logistica.css';

const IMAGENES_SEGUIMIENTO = [
  {
    src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=700&q=80',
    alt: 'Camión de carga en una ruta logística',
  },
  {
    src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80',
    alt: 'Almacén logístico de carga',
  },
  {
    src: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=700&q=80',
    alt: 'Contenedores preparados para transporte',
  },
];

const PORTAL_NAVIGATE = 'GRUPO14_PORTAL_NAVIGATE';

export default function ConsultaCarga() {
  const { rolDe } = useAuth();
  const rol = rolDe('logistica');
  const esPersonal = rol === 'administrador' || rol === 'empleado';
  const esCliente = rol === 'cliente';
  const endpoint = esPersonal
    ? '/logistica/cotizaciones'
    : '/logistica/cotizaciones/mias';
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');
    api.get(endpoint)
      .then((r) => {
        if (activo) setLista(r.data);
      })
      .catch((e) => {
        if (activo) setError(mensajeDeError(e));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [endpoint]);

  const irAMigraciones = (cot) => {
    const portalOrigin =
      import.meta.env.VITE_PORTAL_ORIGIN ||
      (import.meta.env.DEV ? 'http://localhost:5173' : '');
    if (!portalOrigin) {
      setError('No está configurada la navegación hacia el portal.');
      return;
    }

    const params = new URLSearchParams({
      id_cotizacion: String(cot.id),
      codigo: cot.codigo,
    });
    window.parent.postMessage(
      {
        type: PORTAL_NAVIGATE,
        path: `/migraciones/registro?${params.toString()}`,
      },
      portalOrigin
    );
  };

  return (
    <div className="log-container">
      <div className="log-hero">
        <div>
          <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
            LOGÍSTICAMAX › MIS VIAJES Y DESPACHOS
          </div>
          <h1>{esPersonal ? 'Seguimiento de Flota y Despachos' : 'Mis Cotizaciones y Despachos'}</h1>
          <p>
            {esPersonal
              ? 'Consulta las operaciones del equipo, sus rutas y los permisos asociados.'
              : 'Seguimiento de tus cargas, permisos GORE y control migratorio.'}
          </p>
        </div>
        {esCliente && (
          <Link to="/logistica/registro" className="log-btn-sm" style={{ padding: '10px 16px' }}>
            + Nueva Cotización
          </Link>
        )}
        {esPersonal && (
          <Link to="/logistica/panel" className="log-btn-sm log-btn-info" style={{ padding: '10px 16px' }}>
            Abrir panel operativo
          </Link>
        )}
      </div>

      <RutaCamionAnimado origen="SEGUIMIENTO DE FLOTA" destino="CONTROL ADUANERO Y MIGRACIONES" />

      {error && <p className="error">{error}</p>}

      <section className="log-fleet-overview" aria-labelledby="log-fleet-title">
        <header className="log-fleet-heading">
          <div>
            <span>GPS SIMULADO · SEGUIMIENTO VISUAL</span>
            <h2 id="log-fleet-title">Seguimiento de despachos</h2>
          </div>
          <p>La animación ilustra el recorrido; no representa telemetría GPS real.</p>
        </header>
        {lista.length > 0 ? (
          <div className="log-fleet-grid">
            {lista.slice(0, 3).map((operacion, index) => {
              const imagen = IMAGENES_SEGUIMIENTO[index % IMAGENES_SEGUIMIENTO.length];
              return (
                <article className="log-fleet-card" key={operacion.id}>
                  <figure>
                    <img src={imagen.src} alt={imagen.alt} loading="lazy" decoding="async" />
                    <figcaption>{operacion.codigo}</figcaption>
                  </figure>
                  <div className="log-fleet-card-content">
                    <span>UNIDAD ILUSTRATIVA · {index + 1}</span>
                    <h3>{operacion.ruta}</h3>
                    <p>{operacion.carga} · {operacion.toneladas} t</p>
                    <Estado valor={operacion.estado} />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          !cargando && !error && (
            <p className="log-fleet-empty">
              No hay despachos para mostrar en el seguimiento.
            </p>
          )
        )}
      </section>

      <div className="log-table-wrap">
        <table className="log-table">
          <thead>
            <tr>
              <th>Código</th>
              {esPersonal && <th>Cliente</th>}
              <th>Ruta</th>
              <th>Carga</th>
              <th>Tarifa</th>
              <th>Permiso GORE</th>
              <th>Cita Migraciones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={esPersonal ? 9 : 8} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  {esPersonal
                    ? 'No hay cotizaciones registradas para seguimiento.'
                    : 'Aún no tienes cotizaciones registradas.'}
                </td>
              </tr>
            ) : lista.map((c) => (
              <tr key={c.id}>
                <td><span className="log-pill">{c.codigo}</span></td>
                {esPersonal && <td>{c.cliente}</td>}
                <td><strong>{c.ruta}</strong></td>
                <td>
                  {c.carga} ({c.toneladas} t)
                  {c.matpel && <span className="log-pill log-pill-matpel">MATPEL</span>}
                </td>
                <td><strong>S/ {Number(c.monto_calculado).toFixed(2)}</strong></td>
                <td>{c.codigo_tramite ? `${c.codigo_tramite} (${c.estado_tramite})` : '—'}</td>
                <td>{c.codigo_cita ? `${c.codigo_cita} (${c.estado_cita})` : '—'}</td>
                <td><Estado valor={c.estado} /></td>
                <td className="log-actions">
                  {esCliente && c.estado === 'registrado' && (
                    <Link className="log-btn-sm log-btn-info" to={`/logistica/actualizar/${c.id}`}>Editar</Link>
                  )}
                  {esCliente && rolDe('migraciones') === 'cliente' && !c.id_cita && c.estado === 'confirmada' && (
                    <button className="log-btn-sm log-btn-ok" onClick={() => irAMigraciones(c)}>Agendar cita</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}