import './migraciones.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import FormCita from './FormCita.jsx';

export default function RegistroCita() {
  const [searchParams] = useSearchParams();
  const cotizacionParam = searchParams.get('cotizacion');
  const cotizacionId = cotizacionParam ? Number(cotizacionParam) : null;
  const codigoCotizacion = cotizacionId
    ? `COT-${String(cotizacionId).padStart(5, '0')}`
    : null;

  const [valores, setValores] = useState({
    tramite: 'Pasaporte',
    fecha: '',
    hora: '',
    motivo: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    if (!codigoCotizacion) return;
    setValores((prev) => ({
      ...prev,
      motivo: prev.motivo || `Trámite vinculado a viaje/cotización ${codigoCotizacion}`,
    }));
  }, [codigoCotizacion]);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setAviso(null);
    try {
      const { data } = await api.post('/migraciones/citas', {
        ...valores,
        id_cotizacion: cotizacionId || null,
      });
      setAviso({
        ok: true,
        texto: `Cita registrada · ${data.codigo}${
          codigoCotizacion ? ` (vinculada a ${codigoCotizacion})` : ''
        }`,
      });
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container py-4 mig-modulo-wrapper">
      <div className="mig-hero-banner mb-4">
        <img
          src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1400&q=80"
          alt="Migraciones Perú - Nueva cita"
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
                <i className="bi bi-calendar-plus me-1"></i> MIGRACIONES PERÚ · RESERVA EN LÍNEA
              </span>
              <h1 className="mig-titulo-banner m-0">
                Migraciones › Nueva cita
              </h1>
              <p className="m-0 mt-1 text-white-50 small">
                Programa tu atención para pasaporte, carné de extranjería o prórroga de permanencia
              </p>
            </div>
            <div className="mig-hero-badge-card">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80"
                alt="Atención al ciudadano"
                className="mig-mini-thumb"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <strong className="d-block text-white">Reserva Directa</strong>
                <small className="text-warning">Código al instante</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {codigoCotizacion && (
        <div className="alert alert-info d-flex align-items-center gap-2 mb-4" role="status">
          <i className="bi bi-link-45deg fs-5"></i>
          <span>
            Datos precargados desde LogísticaMax: <strong>{codigoCotizacion}</strong>.
          </span>
        </div>
      )}

      {aviso && (
        <div
          className={`${aviso.ok ? 'exito' : 'error'} d-flex align-items-center gap-2 mb-4`}
          role="alert"
        >
          <i
            className={`bi ${
              aviso.ok ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'
            } fs-5`}
          ></i>
          <span className="fw-semibold">{aviso.texto}</span>
        </div>
      )}

      <div className="row g-4 align-items-stretch">
        <div className="col-lg-7">
          <FormCita
            valores={valores}
            setValores={setValores}
            onEnviar={enviar}
            enviando={enviando}
            boton="Agendar cita"
            cotizacionCodigo={codigoCotizacion}
          />
        </div>

        <div className="col-lg-5">
          <div className="mig-side-card h-100 overflow-hidden">
            <div className="mig-side-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80"
                alt="Viajes y control migratorio"
                className="mig-side-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="mig-side-tag">
                <i className="bi bi-passport me-1"></i> Trámites Habilitados
              </span>
            </div>
            <div className="p-4">
              <h5 className="fw-bold text-danger mb-3">
                <i className="bi bi-list-check me-1"></i> ¿Qué necesitas para tu cita?
              </h5>
              <ul className="list-unstyled small text-secondary mb-0 d-grid gap-2">
                <li>
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>
                  <strong>Pasaporte:</strong> DNI vigente sin multas electorales pendientes.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>
                  <strong>Carné de extranjería:</strong> Documentación de residencia al día.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>
                  <strong>Prórroga de permanencia:</strong> Solicitud antes del vencimiento de tu estancia.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}