import './migraciones.css';
import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import MigPageHeader from './MigPageHeader.jsx';

function badgeEstado(estado) {
  const estadoNormalizado = String(estado || '').toLowerCase();
  if (estadoNormalizado.includes('confirm')) {
    return <span className="mig-status mig-status-confirmada">Confirmada</span>;
  }
  if (estadoNormalizado.includes('rechaz')) {
    return <span className="mig-status mig-status-rechazada">Rechazada</span>;
  }
  return <span className="mig-status">Registrada</span>;
}

function listaDeRespuesta(data) {
  return Array.isArray(data) ? data : data?.citas || [];
}

export default function PanelAdmin() {
  const { rolDe } = useAuth();
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState(null);
  const [ocupadoId, setOcupadoId] = useState(null);
  const esAdmin = rolDe('migraciones') === 'administrador';
  const errorDeCarga = Boolean(aviso && !aviso.ok);
  const resumen = (valor) =>
    cargando ? '…' : errorDeCarga ? '—' : valor;
  const registradas = citas.filter(
    (cita) => String(cita.estado || '').toLowerCase() === 'registrado'
  ).length;
  const confirmadas = citas.filter((cita) =>
    String(cita.estado || '').toLowerCase().includes('confirm')
  ).length;

  async function cargarCitas() {
    setCargando(true);
    setAviso(null);
    try {
      const { data } = await api.get('/migraciones/citas');
      setCitas(listaDeRespuesta(data));
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cambiarEstado(id, estado) {
    setOcupadoId(id);
    setAviso(null);
    try {
      await api.patch(`/migraciones/citas/${id}/estado`, { estado });
      const { data } = await api.get('/migraciones/citas');
      setCitas(listaDeRespuesta(data));
      setAviso({
        ok: true,
        texto: `Solicitud #${id} actualizada a "${estado}".`,
      });
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      setOcupadoId(null);
    }
  }

  async function eliminarCita(id) {
    if (!esAdmin) return;
    setOcupadoId(id);
    setAviso(null);
    try {
      await api.delete(`/migraciones/citas/${id}`);
      const { data } = await api.get('/migraciones/citas');
      setCitas(listaDeRespuesta(data));
      setAviso({ ok: true, texto: `Solicitud #${id} eliminada.` });
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      setOcupadoId(null);
    }
  }

  return (
    <div className="mig mig-modulo-wrapper">
      <main className="mig-page-container">
        <MigPageHeader
          title={esAdmin ? 'Panel de administración' : 'Bandeja de atención'}
          description="Revisa las solicitudes recibidas y registra su estado de atención."
          metaLabel="Perfil"
          metaValue={esAdmin ? 'Administrador' : 'Empleado'}
        />

        <section className="mig-admin-metrics" aria-label="Resumen de solicitudes">
          <article>
            <span>Total de solicitudes</span>
            <strong>{resumen(citas.length)}</strong>
          </article>
          <article>
            <span>Pendientes de revisión</span>
            <strong>{resumen(registradas)}</strong>
          </article>
          <article>
            <span>Confirmadas</span>
            <strong>{resumen(confirmadas)}</strong>
          </article>
        </section>

        {aviso && (
          <div
            className={`mig-alert ${aviso.ok ? 'mig-alert-success' : 'mig-alert-error'}`}
            role={aviso.ok ? 'status' : 'alert'}
          >
            {aviso.texto}
          </div>
        )}

        <section className="mig-card">
          <div className="mig-card-heading">
            <div>
              <span className="mig-home-eyebrow">GESTIÓN INTERNA</span>
              <h2>Solicitudes recibidas</h2>
              <p>
                {esAdmin
                  ? 'Puedes actualizar el estado y eliminar registros.'
                  : 'Puedes confirmar o rechazar solicitudes.'}
              </p>
            </div>
            <button
              type="button"
              className="mig-btn-secondary"
              onClick={cargarCitas}
              disabled={cargando || ocupadoId !== null}
            >
              {ocupadoId !== null ? 'Procesando…' : cargando ? 'Actualizando…' : 'Actualizar lista'}
            </button>
          </div>

          {cargando && (
            <p className="mig-inline-state" role="status">
              Cargando solicitudes…
            </p>
          )}

          {!cargando && !errorDeCarga && citas.length === 0 && (
            <div className="mig-empty-state">
              <strong>No hay solicitudes para mostrar</strong>
              <p>Los nuevos registros aparecerán en esta bandeja.</p>
            </div>
          )}

          {!cargando && citas.length > 0 && (
            <div className="mig-table-wrap">
              <table className="mig-table mig-admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Ciudadano</th>
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
                      (idCita
                        ? `MIG-${String(idCita).padStart(5, '0')}`
                        : '—');
                    const estaOcupado = ocupadoId === idCita;

                    return (
                      <tr key={idCita || codigo}>
                        <td className="mig-table-code">{codigo}</td>
                        <td>{cita.ciudadano || cita.nombre || '—'}</td>
                        <td>{cita.tramite}</td>
                        <td>{String(cita.fecha || '').slice(0, 10)}</td>
                        <td>{String(cita.hora || '').slice(0, 5)}</td>
                        <td>{badgeEstado(cita.estado)}</td>
                        <td>
                          <div className="mig-admin-actions">
                            <button
                              type="button"
                              className="mig-action-btn mig-action-confirm"
                              disabled={estaOcupado}
                              onClick={() => cambiarEstado(idCita, 'confirmada')}
                            >
                              {estaOcupado ? 'Procesando…' : 'Confirmar'}
                            </button>
                            <button
                              type="button"
                              className="mig-action-btn mig-action-reject"
                              disabled={estaOcupado}
                              onClick={() => cambiarEstado(idCita, 'rechazado')}
                            >
                              {estaOcupado ? 'Procesando…' : 'Rechazar'}
                            </button>
                            {esAdmin && (
                              <button
                                type="button"
                                className="mig-action-btn mig-action-delete"
                                disabled={estaOcupado}
                                onClick={() => eliminarCita(idCita)}
                              >
                                {estaOcupado ? 'Procesando…' : 'Eliminar'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mig-local-disclaimer">
          Esta bandeja gestiona registros del proyecto Grupo 14; no reemplaza los
          sistemas oficiales de Migraciones Perú.
        </p>
      </main>
    </div>
  );
}
