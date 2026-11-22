import './migraciones.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import Estado from '../../components/Estado.jsx';

export default function ConsultaCita() {
  const [citas, setCitas] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/migraciones/citas/mias').then((r) => setCitas(r.data)).catch((e) => setError(mensajeDeError(e)));
  }, []);

  return (
    <div className="container py-4 mig-modulo-wrapper">
      <div className="mig-hero-banner mb-4">
        <img
          src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1400&q=80"
          alt="Migraciones Perú - Mis citas"
          className="mig-hero-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="mig-avion-ruta" aria-hidden="true">
          <i className="bi bi-airplane-fill"></i>
        </span>
        <div className="mig-hero-overlay">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge bg-warning text-dark fw-bold mb-2 px-3 py-2">
                <i className="bi bi-card-checklist me-1"></i> MIGRACIONES PERÚ · HISTORIAL DE CITAS
              </span>
              <h1 className="mig-titulo-banner m-0">
                Migraciones › Mis citas
              </h1>
              <p className="m-0 mt-1 text-white-50 small">
                Consulta el estado de tus citas programadas y reprograma las que estén registradas
              </p>
            </div>
            <div className="mig-hero-badge-card">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                alt="Documentos de viaje"
                className="mig-mini-thumb"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <strong className="d-block text-white">
                  {citas ? `${citas.length} ${citas.length === 1 ? 'cita' : 'citas'}` : 'Cargando...'}
                </strong>
                <small className="text-warning">Seguimiento en línea</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <span>{error}</span>
        </div>
      )}

      {citas && !citas.length && (
        <div className="mig-empty-card p-5 text-center mb-4">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80"
            alt="Sin citas registradas"
            className="mig-empty-img mb-3"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h5 className="fw-bold text-danger mb-2">
            <i className="bi bi-calendar-x me-1"></i> Aún no tienes citas registradas
          </h5>
          <p className="text-secondary mb-3">
            Aún no tienes citas. Agenda la primera desde «nueva cita».
          </p>
          <Link to="/migraciones/registro" className="btn mig-btn-submit px-4 py-2">
            <i className="bi bi-calendar-plus me-1"></i> Ir a nueva cita
          </Link>
        </div>
      )}

      {citas?.length > 0 && (
        <div className="mig-table-card p-3 p-md-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-table text-danger fs-5"></i>
              <h5 className="m-0 fw-bold text-dark">Detalle de tus citas</h5>
            </div>
            <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-2">
              Total: {citas.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mig-tabla-pro mb-0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Trámite</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th className="text-end">Acción</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id} className="mig-fila-cita">
                    <td className="fw-bold text-danger">{c.codigo}</td>
                    <td className="fw-semibold">{c.tramite}</td>
                    <td>
                      <i className="bi bi-calendar3 text-danger me-1"></i>
                      {c.fecha}
                    </td>
                    <td>
                      <i className="bi bi-clock text-danger me-1"></i>
                      {c.hora}
                    </td>
                    <td><Estado valor={c.estado} /></td>
                    <td className="text-end">
                      {c.estado === 'registrado' && (
                        <Link
                          to={`/migraciones/actualizar/${c.id}`}
                          className="btn btn-sm mig-btn-cambiar"
                        >
                          <i className="bi bi-pencil-square me-1"></i> Cambiar
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}