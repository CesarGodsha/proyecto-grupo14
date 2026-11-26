import './migraciones.css';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import FormCita from './FormCita.jsx';
import MigPageHeader from './MigPageHeader.jsx';

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
          (cita) => String(cita.id ?? cita.id_cita) === String(id)
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
        texto: `Solicitud #${id} actualizada correctamente.`,
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
          title="Actualizar solicitud"
          description={`Modifica los datos de la solicitud #${id} mientras se encuentre registrada.`}
          action={
            <Link className="mig-back-link" to="/migraciones/consulta">
              ← Volver a mis solicitudes
            </Link>
          }
        />

        {aviso && (
          <div
            className={`mig-alert ${aviso.ok ? 'mig-alert-success' : 'mig-alert-error'}`}
            role={aviso.ok ? 'status' : 'alert'}
          >
            {aviso.texto}
          </div>
        )}

        <section className="mig-card mig-edit-card">
          {cargando ? (
            <p className="mig-inline-state" role="status">
              Cargando datos de la solicitud…
            </p>
          ) : (
            <FormCita
              valores={valores}
              setValores={setValores}
              onEnviar={enviar}
              enviando={enviando}
              boton="Guardar cambios"
            />
          )}
        </section>

        <p className="mig-local-disclaimer">
          Los cambios se guardan en el módulo de Grupo 14 y no actualizan una
          cita en el sistema oficial de Migraciones Perú.
        </p>
      </main>
    </div>
  );
}
