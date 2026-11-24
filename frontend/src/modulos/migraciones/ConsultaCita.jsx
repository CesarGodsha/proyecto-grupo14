import './migraciones.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import FondoEstrellasMigraciones from './FondoEstrellasMigraciones.jsx';

function badgeEstado(estado) {
  const e = String(estado || '').toLowerCase();
  if (e.includes('confirm')) {
    return <span className="badge bg-success">Confirmada</span>;
  }
  if (e.includes('rechaz')) {
    return <span className="badge bg-danger">Rechazada</span>;
  }
  return <span className="badge bg-secondary">Registrado</span>;
}

export default function ConsultaCita() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    async function cargar() {
      setCargando(true);
      setError('');
      try {
        const { data } = await api.get('/migraciones/citas/mias');
        if (!activo) return;
        setCitas(Array.isArray(data) ? data : data?.citas || []);
      } catch (err) {
        if (!activo) return;
        setError(mensajeDeError(err));
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="mig mig-modulo-wrapper">
      <FondoEstrellasMigraciones />
      <div className="container py-4">
        <div className="mig-hero-banner mig-anim-entrada mb-4">
          <div className="mig-hero-glow" aria-hidden="true" />
          <span className="mig-avion-ruta" aria-hidden="true">
            <i className="bi bi-airplane-fill"></i>
          </span>
          <div className="mig-hero-overlay">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <span className="badge bg-warning text-dark fw-bold mb-2 px-3 py-2">
                  <i className="bi bi-folder2-open me-1"></i> MIGRACIONES PERÚ · HISTORIAL DE CITAS
                </span>
                <h1 className="mig-titulo-banner m-0">
                  Migraciones › Mis citas
                </h1>
                <p className="m-0 mt-1 text-white-50 small">
                  Consulta el estado de tus citas programadas y reprograma las que estén registradas
                </p>
              </div>
              <div className="mig-hero-badge-card">
                <i className="bi bi-clock-history fs-4 text-warning"></i>
                <div>
                  <strong className="d-block text-white">Seguimiento</strong>
                  <small className="text-warning">Estado en tiempo real</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tarjeta mig-anim-entrada mig-anim-retraso-1">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <h5 className="m-0 fw-bold text-dark">
              <i className="bi bi-calendar-check me-2 text-danger"></i>
              Citas registradas
            </h5>
            <Link to="/migraciones/registro" className="btn btn-sm mig-btn-submit px-3 py-2">
              <i className="bi bi-plus-circle me-1"></i> Nueva cita
            </Link>
          </div>

          {cargando && (
            <p className="text-muted m-0">Cargando tus citas…</p>
          )}

          {!cargando && error && (
            <div className="error d-flex align-items-center gap-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          {!cargando && !error && citas.length === 0 && (
            <p className="text-muted m-0">
              Aún no tienes citas registradas. Puedes agendar una desde <strong>Nueva cita</strong>.
            </p>
          )}

          {!cargando && !error && citas.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle m-0">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Trámite</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((cita) => {
                    const idCita = cita.id ?? cita.id_cita;
                    const codigo =
                      cita.codigo ||
                      (idCita ? `MIG-${String(idCita).padStart(5, '0')}` : '—');
                    const esRegistrado =
                      String(cita.estado || '').toLowerCase() === 'registrado';

                    return (
                      <tr key={idCita || codigo}>
                        <td className="fw-bold">{codigo}</td>
                        <td>{cita.tramite}</td>
                        <td>{String(cita.fecha || '').slice(0, 10)}</td>
                        <td>{String(cita.hora || '').slice(0, 5)}</td>
                        <td>{badgeEstado(cita.estado)}</td>
                        <td>
                          {esRegistrado && idCita ? (
                            <Link to={`/migraciones/actualizar/${idCita}`}>
                              Cambiar
                            </Link>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}