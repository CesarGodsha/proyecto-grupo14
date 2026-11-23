import './migraciones.css';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import FormCita from './FormCita.jsx';
import FondoEstrellasMigraciones from './FondoEstrellasMigraciones.jsx';

export default function ActualizarCita() {
  const { id } = useParams();
  const [valores, setValores] = useState({
    tramite: 'Pasaporte',
    fecha: '',
    hora: '',
  });
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    let activo = true;
    async function cargarCita() {
      setCargando(true);
      setAviso(null);
      try {
        const { data } = await api.get('/migraciones/citas/mias');
        if (!activo) return;
        const lista = Array.isArray(data) ? data : data?.citas || [];
        const encontrada = lista.find(
          (c) => String(c.id ?? c.id_cita) === String(id)
        );
        if (encontrada) {
          setValores({
            tramite: encontrada.tramite || 'Pasaporte',
            fecha: String(encontrada.fecha || '').slice(0, 10),
            hora: String(encontrada.hora || '').slice(0, 5),
          });
        }
      } catch (err) {
        if (!activo) return;
        setAviso({ ok: false, texto: mensajeDeError(err) });
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargarCita();
    return () => {
      activo = false;
    };
  }, [id]);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setAviso(null);
    try {
      await api.put(`/migraciones/citas/${id}`, valores);
      setAviso({
        ok: true,
        texto: `Cita #${id} actualizada correctamente.`,
      });
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      setEnviando(false);
    }
  }

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
                  <i className="bi bi-pencil-square me-1"></i> MIGRACIONES PERÚ · REPROGRAMACIÓN
                </span>
                <h1 className="mig-titulo-banner m-0">
                  Migraciones › Cambiar cita
                </h1>
                <p className="m-0 mt-1 text-white-50 small">
                  Modifica el trámite, fecha u horario de tu cita registrada #{id}
                </p>
              </div>
              <Link
                to="/migraciones/consulta"
                className="btn btn-sm btn-outline-light px-3 py-2"
              >
                <i className="bi bi-arrow-left me-1"></i> Volver a mis citas
              </Link>
            </div>
          </div>
        </div>

        {aviso && (
          <div
            className={`${aviso.ok ? 'exito' : 'error'} mig-anim-entrada d-flex align-items-center gap-2 mb-4`}
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

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="tarjeta mig-anim-entrada mig-anim-retraso-1">
              {cargando ? (
                <p className="text-muted m-0">Cargando datos de la cita…</p>
              ) : (
                <FormCita
                  valores={valores}
                  setValores={setValores}
                  onEnviar={enviar}
                  enviando={enviando}
                  boton="Guardar cambios"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}