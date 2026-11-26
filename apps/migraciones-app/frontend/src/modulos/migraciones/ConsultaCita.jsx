import './migraciones.css';
import { Link } from 'react-router-dom';
import useApiResource from '../../hooks/useApiResource.js';
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

export default function ConsultaCita() {
  const { rolDe } = useAuth();
  const rol = rolDe('migraciones');
  const esPersonal = rol === 'administrador' || rol === 'empleado';
  const esCliente = rol === 'cliente';
  const endpoint = esPersonal
    ? '/migraciones/citas'
    : '/migraciones/citas/mias';
  const { data: citas, cargando, error } = useApiResource(endpoint);
  const cantidad = `${citas.length} ${
    citas.length === 1 ? 'solicitud' : 'solicitudes'
  }`;

  return (
    <div className="mig mig-modulo-wrapper">
      <main className="mig-page-container">
        <MigPageHeader
          title={esPersonal ? 'Consultar citas del módulo' : 'Mis citas'}
          description={
            esPersonal
              ? 'Consulta las solicitudes recibidas y accede a la bandeja para atenderlas.'
              : 'Consulta el estado de tus registros y actualiza los que aún estén pendientes.'
          }
          metaLabel={esPersonal ? 'Registros del módulo' : 'Registros en tu cuenta'}
          metaValue={cantidad}
        />

        <section className="mig-card">
          <div className="mig-card-heading">
            <div>
              <span className="mig-home-eyebrow">SEGUIMIENTO</span>
              <h2>{esPersonal ? 'Solicitudes migratorias' : 'Tus citas registradas'}</h2>
            </div>
            {esCliente && (
              <Link className="mig-btn-submit mig-btn-link" to="/migraciones/registro">
                Nueva solicitud <span aria-hidden="true">+</span>
              </Link>
            )}
            {esPersonal && (
              <Link className="mig-btn-submit mig-btn-link" to="/migraciones/panel">
                Abrir bandeja <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          {cargando && (
            <p className="mig-inline-state" role="status">
              {esPersonal ? 'Cargando solicitudes del módulo…' : 'Cargando tus solicitudes…'}
            </p>
          )}

          {!cargando && error && (
            <div className="mig-alert mig-alert-error" role="alert">
              {error}
            </div>
          )}

          {!cargando && !error && esCliente && citas.length === 0 && (
            <div className="mig-empty-state">
              <strong>Aún no tienes solicitudes registradas</strong>
              <p>
                Cuando envíes una solicitud desde este módulo, aparecerá aquí
                para que puedas consultarla.
              </p>
              <Link to="/migraciones/registro">Registrar una solicitud →</Link>
            </div>
          )}

          {!cargando && !error && esPersonal && citas.length === 0 && (
            <div className="mig-empty-state">
              <strong>No hay solicitudes para consultar</strong>
              <p>Las solicitudes recibidas aparecerán aquí.</p>
            </div>
          )}

          {!cargando && !error && citas.length > 0 && (
            <div className="mig-table-wrap">
              <table className="mig-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    {esPersonal && <th>Ciudadano</th>}
                    <th>Trámite</th>
                    <th>Fecha preferida</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    {esCliente && <th>Acción</th>}
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
                    const sePuedeEditar =
                      String(cita.estado || '').toLowerCase() === 'registrado';

                    return (
                      <tr key={idCita || codigo}>
                        <td className="mig-table-code">{codigo}</td>
                        {esPersonal && <td>{cita.ciudadano || cita.nombre || '—'}</td>}
                        <td>{cita.tramite}</td>
                        <td>{String(cita.fecha || '').slice(0, 10)}</td>
                        <td>{String(cita.hora || '').slice(0, 5)}</td>
                        <td>{badgeEstado(cita.estado)}</td>
                        {esCliente && (
                          <td>
                            {sePuedeEditar && idCita ? (
                              <Link
                                className="mig-table-action"
                                to={`/migraciones/actualizar/${idCita}`}
                              >
                                Cambiar
                              </Link>
                            ) : (
                              <span className="mig-table-muted">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mig-local-disclaimer">
          El estado corresponde a los registros de este módulo de Grupo 14; para
          trámites oficiales, utiliza los canales de Migraciones Perú.
        </p>
      </main>
    </div>
  );
}
