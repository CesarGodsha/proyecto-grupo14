import './migraciones.css';
import { useEffect, useState } from 'react';
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

function extraerRolMigraciones(fuente) {
  if (!fuente || typeof fuente !== 'object') return '';
  const datos = fuente.usuario || fuente.user || fuente;

  if (typeof datos.rol === 'string' && datos.rol.trim()) {
    return datos.rol.trim().toLowerCase();
  }
  if (typeof datos.rol_migraciones === 'string' && datos.rol_migraciones.trim()) {
    return datos.rol_migraciones.trim().toLowerCase();
  }
  if (datos.roles && typeof datos.roles === 'object' && !Array.isArray(datos.roles)) {
    const rMig = datos.roles.migraciones;
    if (typeof rMig === 'string') return rMig.trim().toLowerCase();
    if (rMig && typeof rMig.rol === 'string') return rMig.rol.trim().toLowerCase();
  }
  if (Array.isArray(datos.roles)) {
    const match = datos.roles.find(
      (item) =>
        (typeof item === 'object' &&
          String(item?.modulo || '').toLowerCase() === 'migraciones') ||
        typeof item === 'string'
    );
    if (typeof match === 'string') return match.trim().toLowerCase();
    if (match?.rol) return String(match.rol).trim().toLowerCase();
  }
  if (Array.isArray(datos.modulos)) {
    const match = datos.modulos.find(
      (m) => String(m?.modulo || m?.nombre || '').toLowerCase() === 'migraciones'
    );
    if (match?.rol) return String(match.rol).trim().toLowerCase();
  }
  return '';
}

function detectarEsAdmin(propUsuario) {
  if (extraerRolMigraciones(propUsuario) === 'administrador') return true;
  if (extraerRolMigraciones(propUsuario) === 'admin') return true;

  const almacenamientos = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const clave = localStorage.key(i);
      const raw = localStorage.getItem(clave);
      if (!raw) continue;
      try {
        almacenamientos.push(JSON.parse(raw));
      } catch {
        const val = raw.trim().toLowerCase();
        if (val === 'administrador' || val === 'admin') return true;
      }
    }
  } catch {
    // Ignorar errores de acceso a storage
  }

  try {
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const clave = sessionStorage.key(i);
      const raw = sessionStorage.getItem(clave);
      if (!raw) continue;
      try {
        almacenamientos.push(JSON.parse(raw));
      } catch {
        const val = raw.trim().toLowerCase();
        if (val === 'administrador' || val === 'admin') return true;
      }
    }
  } catch {
    // Ignorar errores de acceso a storage
  }

  for (const obj of almacenamientos) {
    const rol = extraerRolMigraciones(obj);
    if (rol === 'administrador' || rol === 'admin') return true;

    const email = String(
      obj?.email || obj?.usuario?.email || obj?.user?.email || ''
    )
      .trim()
      .toLowerCase();
    if (email === 'admin@migraciones.pe') return true;
  }

  return false;
}

export default function PanelAdmin({ usuario }) {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState(null);
  const [ocupadoId, setOcupadoId] = useState(null);

  const esAdmin = detectarEsAdmin(usuario);

  async function cargarCitas(silencioso = false) {
    if (!silencioso) setCargando(true);
    setAviso(null);
    try {
      const { data } = await api.get('/migraciones/citas');
      setCitas(Array.isArray(data) ? data : data?.citas || []);
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      if (!silencioso) setCargando(false);
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
      setAviso({
        ok: true,
        texto: `Cita #${id} marcada como "${estado}".`,
      });
      await cargarCitas(true);
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
      setAviso({
        ok: true,
        texto: `Cita #${id} eliminada.`,
      });
      await cargarCitas(true);
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      setOcupadoId(null);
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
                  <i className="bi bi-sliders me-1"></i> MIGRACIONES PERÚ · CONTROL OPERATIVO
                </span>
                <h1 className="mig-titulo-banner m-0">
                  {esAdmin
                    ? 'Migraciones › Panel de administración'
                    : 'Migraciones › Panel de citas'}
                </h1>
                <p className="m-0 mt-1 text-white-50 small">
                  {esAdmin
                    ? 'Privilegios completos: confirma o rechaza citas y elimina registros'
                    : 'Revisa solicitudes ciudadanas y confirma o rechaza citas'}
                </p>
              </div>
              <div className="mig-hero-badge-card">
                <i className="bi bi-person-badge fs-4 text-warning"></i>
                <div>
                  <strong className="d-block text-white">
                    {esAdmin ? 'Administrador' : 'Empleado'}
                  </strong>
                  <small className="text-warning">
                    {esAdmin ? 'Confirmar, Rechazar y Eliminar' : 'Solo Confirmar y Rechazar'}
                  </small>
                </div>
              </div>
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

        <div className="tarjeta mig-anim-entrada mig-anim-retraso-1">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div>
              <h5 className="m-0 fw-bold text-dark">
                <i className="bi bi-table me-2 text-danger"></i>
                Todas las citas ({citas.length})
              </h5>
              <small className="text-muted">
                {esAdmin
                  ? 'Modo administrador: puedes confirmar, rechazar y eliminar citas.'
                  : 'Modo empleado: puedes confirmar o rechazar citas.'}
              </small>
            </div>
            <button
              type="button"
              className="btn btn-sm px-3 py-2"
              onClick={() => cargarCitas(true)}
              disabled={cargando || ocupadoId !== null}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Actualizar lista
            </button>
          </div>

          {cargando && <p className="text-muted m-0">Cargando citas…</p>}

          {!cargando && citas.length === 0 && (
            <p className="text-muted m-0">No hay citas registradas por el momento.</p>
          )}

          {!cargando && citas.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle m-0">
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
                      (idCita ? `MIG-${String(idCita).padStart(5, '0')}` : '—');
                    const estaOcupado = ocupadoId === idCita;

                    return (
                      <tr key={idCita || codigo}>
                        <td className="fw-bold">{codigo}</td>
                        <td>{cita.ciudadano || cita.nombre || '—'}</td>
                        <td>{cita.tramite}</td>
                        <td>{String(cita.fecha || '').slice(0, 10)}</td>
                        <td>{String(cita.hora || '').slice(0, 5)}</td>
                        <td>{badgeEstado(cita.estado)}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              disabled={estaOcupado}
                              onClick={() => cambiarEstado(idCita, 'confirmada')}
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              disabled={estaOcupado}
                              onClick={() => cambiarEstado(idCita, 'rechazado')}
                            >
                              Rechazar
                            </button>
                            {esAdmin && (
                              <button
                                type="button"
                                className="btn btn-sm btn-dark"
                                disabled={estaOcupado}
                                onClick={() => eliminarCita(idCita)}
                              >
                                Eliminar
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
        </div>
      </div>
    </div>
  );
}