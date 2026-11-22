import './migraciones.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import FormCita from './FormCita.jsx';

export default function ActualizarCita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valores, setValores] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/migraciones/citas/mias').then((r) => {
      const c = r.data.find((x) => String(x.id) === id);
      if (c) setValores({ tramite: c.tramite, fecha: c.fecha, hora: c.hora });
      else setError('No encontramos esa cita');
    }).catch((e) => setError(mensajeDeError(e)));
  }, [id]);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      await api.put(`/migraciones/citas/${id}`, valores);
      navigate('/migraciones/consulta');
    } catch (err) {
      setError(mensajeDeError(err));
      setEnviando(false);
    }
  }

  return (
    <div className="container py-4 mig-modulo-wrapper">
      <div className="mig-hero-banner mb-4">
        <img
          src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1400&q=80"
          alt="Migraciones Perú"
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
                <i className="bi bi-calendar2-check me-1"></i> MIGRACIONES PERÚ · REPROGRAMACIÓN
              </span>
              <h1 className="mig-titulo-banner m-0">
                Migraciones › Cambiar cita
              </h1>
              <p className="m-0 mt-1 text-white-50 small">
                Modifica el trámite, fecha u horario de tu cita registrada #{id}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light btn-sm fw-semibold px-3 py-2"
              onClick={() => navigate('/migraciones/consulta')}
            >
              <i className="bi bi-arrow-left me-1"></i> Volver a mis citas
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="row g-4 align-items-stretch">
        <div className="col-lg-7">
          {!valores && !error ? (
            <div className="mig-card-panel p-5 text-center">
              <div className="spinner-border text-danger mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="m-0 fw-semibold text-secondary">
                Cargando datos de la cita #{id}...
              </p>
            </div>
          ) : (
            valores && (
              <div className="mig-card-panel p-4 h-100">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-danger-subtle">
                  <i className="bi bi-pencil-square text-danger fs-4"></i>
                  <h5 className="m-0 fw-bold text-dark">Datos de la cita a actualizar</h5>
                </div>
                <FormCita
                  valores={valores}
                  setValores={setValores}
                  onEnviar={enviar}
                  enviando={enviando}
                  boton="Guardar cambios"
                />
              </div>
            )
          )}
        </div>

        <div className="col-lg-5">
          <div className="mig-side-card h-100 overflow-hidden">
            <div className="mig-side-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80"
                alt="Pasaporte y documentación migratoria"
                className="mig-side-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="mig-side-tag">
                <i className="bi bi-shield-lock-fill me-1"></i> Atención Segura
              </span>
            </div>
            <div className="p-4">
              <h5 className="fw-bold text-danger mb-2">
                <i className="bi bi-info-circle-fill me-1"></i> Recomendaciones para reprogramar
              </h5>
              <ul className="list-unstyled small text-secondary mb-0 d-grid gap-2">
                <li>
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>
                  Verifica que la nueva fecha no coincida con feriados nacionales.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>
                  Preséntate 15 minutos antes con tu documento de identidad vigente.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>
                  Al guardar los cambios, volverás automáticamente a tu lista de citas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}