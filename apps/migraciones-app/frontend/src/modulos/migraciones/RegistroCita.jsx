import './migraciones.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import FormCita from './FormCita.jsx';
import MigPageHeader from './MigPageHeader.jsx';

const TIPOS_DE_TRAMITE = [
  'Pasaporte',
  'Carné de extranjería',
  'Prórroga de permanencia',
];

export default function RegistroCita() {
  const [searchParams] = useSearchParams();
  const cotizacionParam =
    searchParams.get('cotizacion') || searchParams.get('id_cotizacion');
  const tramiteParam = searchParams.get('tramite');
  const cotizacionId = cotizacionParam ? Number(cotizacionParam) : null;
  const codigoCotizacion = cotizacionId
    ? `COT-${String(cotizacionId).padStart(5, '0')}`
    : null;

  const [valores, setValores] = useState({
    tramite: TIPOS_DE_TRAMITE.includes(tramiteParam) ? tramiteParam : 'Pasaporte',
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
      motivo:
        prev.motivo || `Trámite vinculado a viaje/cotización ${codigoCotizacion}`,
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
        texto: `Solicitud registrada · ${data.codigo}${
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
    <div className="mig mig-modulo-wrapper">
      <main className="mig-page-container">
        <MigPageHeader
          title="Nueva solicitud de cita"
          description="Registra los datos de tu solicitud y consulta su estado desde tu cuenta."
          metaLabel="Módulo de atención"
          metaValue="Solicitud digital"
        />

        {codigoCotizacion && (
          <div className="mig-alert mig-alert-info" role="status">
            <strong>Operación vinculada:</strong> Los datos se asociaron a la
            cotización <strong>{codigoCotizacion}</strong>.
          </div>
        )}

        {aviso && (
          <div
            className={`mig-alert ${aviso.ok ? 'mig-alert-success' : 'mig-alert-error'}`}
            role={aviso.ok ? 'status' : 'alert'}
          >
            {aviso.texto}
          </div>
        )}

        <div className="mig-registration-layout">
          <section className="mig-card">
            <FormCita
              valores={valores}
              setValores={setValores}
              onEnviar={enviar}
              enviando={enviando}
              boton="Registrar solicitud"
              cotizacionCodigo={codigoCotizacion}
            />
          </section>

          <aside className="mig-side-card">
            <figure className="theme-photo mig-side-photo">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80"
                alt="Avión en vuelo, imagen ilustrativa de viajes y trámites migratorios"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <figcaption>Viajes y control migratorio</figcaption>
            </figure>
            <div className="mig-side-heading">
              <span className="mig-side-icon" aria-hidden="true">01</span>
              <div>
                <span className="mig-side-kicker">ORIENTACIÓN</span>
                <h2>Antes de continuar</h2>
              </div>
            </div>
            <ol className="mig-check-list">
              <li>
                <span>01</span>
                <p>Ten a la mano los datos de identificación que solicita el trámite.</p>
              </li>
              <li>
                <span>02</span>
                <p>Confirma los requisitos actualizados en los canales oficiales.</p>
              </li>
              <li>
                <span>03</span>
                <p>La fecha registrada aquí no confirma una cita en el sistema oficial.</p>
              </li>
            </ol>
          </aside>
        </div>

        <section className="mig-official-links" aria-labelledby="mig-official-title">
          <div>
            <span className="mig-home-eyebrow">INFORMACIÓN VERIFICADA</span>
            <h2 id="mig-official-title">Canales oficiales de Migraciones</h2>
            <p>
              Revisa requisitos vigentes y realiza trámites oficiales en los
              portales de la Superintendencia Nacional de Migraciones.
            </p>
          </div>
          <div className="mig-official-links-list">
            <a href="https://www.gob.pe/migraciones" target="_blank" rel="noreferrer">
              Gob.pe · Migraciones <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://citaspasaporte.migraciones.gob.pe/citas-pasaporte-v2/"
              target="_blank"
              rel="noreferrer"
            >
              Citas oficiales para pasaporte <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://sel.migraciones.gob.pe/servmig-inmtra/VerEstadoTramiteIMRev"
              target="_blank"
              rel="noreferrer"
            >
              Seguimiento de trámites <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <p className="mig-local-disclaimer">
          Este formulario pertenece al proyecto Grupo 14 y no genera una cita en
          los sistemas oficiales de Migraciones Perú.
        </p>
      </main>
    </div>
  );
}
