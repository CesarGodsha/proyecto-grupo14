import './migraciones.css';
import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Estado from '../../components/Estado.jsx';

export default function PanelAdmin() {
  const { rolDe } = useAuth();
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');
  const cargar = () => api.get('/migraciones/citas').then((r) => setCitas(r.data)).catch((e) => setError(mensajeDeError(e)));
  useEffect(() => { cargar(); }, []);

  const accion = (promesa) => promesa.then(cargar).catch((e) => setError(mensajeDeError(e)));
  const estado = (id, nuevo) => accion(api.patch(`/migraciones/citas/${id}/estado`, { estado: nuevo }));
  const borrar = (id) => accion(api.delete(`/migraciones/citas/${id}`));

  const esAdmin = rolDe('migraciones') === 'administrador';
  const totalConfirmadas = citas.filter((c) => c.estado === 'confirmada').length;
  const totalPendientes = citas.filter((c) => c.estado === 'registrado').length;

  return (
    <div className="container py-4 mig-modulo-wrapper">
      <div className="mig-hero-banner mb-4">
        <img
          src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1400&q=80"
          alt="Migraciones Perú - Panel de citas"
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
                <i className="bi bi-shield-lock me-1"></i> MIGRACIONES PERÚ · CONTROL OPERATIVO
              </span>
              <h1 className="mig-titulo-banner m-0">
                Migraciones › Panel de citas
              </h1>
              <p className="m-0 mt-1 text-white-50 small">
                Revisa solicitudes ciudadanas, aprueba o rechaza citas y gestiona registros
              </p>
            </div>
            <div className="mig-hero-badge-card">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80"
                alt="Gestión administrativa"
                className="mig-mini-thumb"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <strong className="d-block text-white text-capitalize">
                  Rol: {rolDe('migraciones') || 'operador'}
                </strong>
                <small className="text-warning">{citas.length} citas en total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="mig-stat-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="small text-muted fw-semibold d-block">Citas totales</span>
              <span className="fs-3 fw-bold text-danger">{citas.length}</span>
            </div>
            <i className="bi bi-calendar2-week fs-1 text-danger opacity-75"></i>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mig-stat-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="small text-muted fw-semibold d-block">Pendientes (registrado)</span>
              <span className="fs-3 fw-bold text-warning">{totalPendientes}</span>
            </div>
            <i className="bi bi-hourglass-split fs-1 text-warning"></i>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mig-stat-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="small text-muted fw-semibold d-block">Confirmadas</span>
              <span className="fs-3 fw-bold text-success">{totalConfirmadas}</span>
            </div>
            <i className="bi bi-patch-check-fill fs-1 text-success"></i>
          </div>
        </div>
      </div>

      {error && (
        <div className="error d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="mig-table-card p-3 p-md-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-kanban text-danger fs-5"></i>
            <h5 className="m-0 fw-bold text-dark">Bandeja de citas registradas</h5>
          </div>
          <button
            type="button"
            className="btn btn-sm mig-btn-refrescar"
            onClick={cargar}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Actualizar lista
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mig-tabla-pro mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Ciudadano</th>
                <th>Trámite</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id} className="mig-fila-cita">
                  <td className="fw-bold text-danger">{c.codigo}</td>
                  <td className="fw-semibold">
                    <i className="bi bi-person-badge text-danger me-1"></i>
                    {c.ciudadano}
                  </td>
                  <td>{c.tramite}</td>
                  <td>{c.fecha}</td>
                  <td>{c.hora}</td>
                  <td><Estado valor={c.estado} /></td>
                  <td className="acciones text-end">
                    <div className="d-inline-flex flex-wrap justify-content-end gap-1">
                      <button
                        type="button"
                        className="btn btn-sm mig-btn-confirmar"
                        onClick={() => estado(c.id, 'confirmada')}
                      >
                        <i className="bi bi-check-lg me-1"></i>Confirmar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm mig-btn-rechazar"
                        onClick={() => estado(c.id, 'rechazado')}
                      >
                        <i className="bi bi-x-lg me-1"></i>Rechazar
                      </button>
                      {esAdmin && (
                        <button
                          type="button"
                          className="btn btn-sm mig-btn-eliminar"
                          onClick={() => borrar(c.id)}
                        >
                          <i className="bi bi-trash3 me-1"></i>Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!citas.length && !error && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No hay citas registradas por el momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}