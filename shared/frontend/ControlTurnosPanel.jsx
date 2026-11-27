import { useEffect, useState } from 'react';
import './control-turnos.css';

export default function ControlTurnosPanel({ api, mensajeDeError, ruta, modulo }) {
  const [trabajadores, setTrabajadores] = useState([]);
  const [email, setEmail] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [ocupado, setOcupado] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function cargar() {
    setError('');
    setErrorCarga(false);
    try {
      const { data } = await api.get(ruta);
      setTrabajadores(data);
    } catch (e) {
      setError(mensajeDeError(e));
      setErrorCarga(true);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { void cargar(); }, []);

  async function guardar(e) {
    e.preventDefault();
    setOcupado('guardar');
    setError('');
    setMensaje('');
    try {
      await api.put(ruta, {
        email: email.trim(),
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      });
      setMensaje(`Se guardó el horario permitido para ${email.trim()}.`);
      setEmail('');
      setHoraInicio('');
      setHoraFin('');
      await cargar();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setOcupado('');
    }
  }

  async function quitar(trabajador) {
    setOcupado(trabajador.email);
    setError('');
    setMensaje('');
    try {
      await api.delete(ruta, { data: { email: trabajador.email } });
      setMensaje(`Se quitó la restricción horaria de ${trabajador.email}.`);
      await cargar();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setOcupado('');
    }
  }

  function editar(trabajador) {
    setEmail(trabajador.email);
    setHoraInicio(trabajador.hora_inicio || '');
    setHoraFin(trabajador.hora_fin || '');
    setError('');
    setMensaje(`Editando el horario de ${trabajador.email}.`);
  }

  const horarioValido =
    email.trim() &&
    horaInicio &&
    horaFin &&
    horaInicio !== horaFin;
  const claseTema =
    modulo === 'Migraciones'
      ? 'control-turnos-page--migraciones'
      : modulo === 'Logística'
        ? 'control-turnos-page--logistica'
        : '';

  return (
    <main className={`control-turnos-page ${claseTema}`}>
      <section className="control-turnos-shell">
        <div className="ct-glow" aria-hidden="true" />
        <div className="ct-content">
          <header className="ct-heading">
            <span className="ct-heading-icon" aria-hidden="true">◷</span>
            <div>
              <p className="ct-kicker">GESTIÓN DE PERSONAL · {modulo}</p>
              <h1>Control de turnos</h1>
              <p className="ct-intro">Administra cuándo puede ingresar cada trabajador.</p>
            </div>
          </header>

          <div className="ct-notice">
            <span className="ct-notice-icon" aria-hidden="true">i</span>
            <p>
              El trabajador podrá ingresar <strong>entre la hora de inicio y la hora de fin</strong>.
              Fuera de ese intervalo se bloquearán sus funciones. Se repite todos los días,
              usa la hora de Perú y también admite turnos que cruzan medianoche.
              Si no tiene horario guardado, conserva el acceso sin restricción.
            </p>
          </div>

          {error && <div className="ct-alert ct-alert-error" role="alert">{error}</div>}
          {mensaje && <div className="ct-alert ct-alert-success" role="status">{mensaje}</div>}

          <section className="ct-form-card" aria-labelledby="ct-form-title">
            <div className="ct-section-heading">
              <div>
                <p className="ct-kicker">NUEVA REGLA</p>
                <h2 id="ct-form-title">Asignar horario permitido</h2>
              </div>
              <span className="ct-step">01</span>
            </div>
            <form className="ct-form" onSubmit={guardar}>
              <label className="ct-field">
                <span>Correo del trabajador</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="trabajador@correo.pe"
                  value={email}
                  disabled={Boolean(ocupado)}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="ct-field">
                <span>Puede ingresar desde</span>
                <input
                  type="time"
                  value={horaInicio}
                  disabled={Boolean(ocupado)}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
              </label>
              <label className="ct-field">
                <span>Puede ingresar hasta</span>
                <input
                  type="time"
                  value={horaFin}
                  disabled={Boolean(ocupado)}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                />
              </label>
              <button
                className="ct-button ct-button-primary"
                type="submit"
                disabled={!horarioValido || Boolean(ocupado)}
              >
                {ocupado === 'guardar' ? 'Guardando…' : 'Guardar horario'}
              </button>
            </form>
            {horaInicio && horaFin && horaInicio === horaFin && (
              <p className="ct-field-error" role="alert">La hora de inicio y fin deben ser distintas.</p>
            )}
          </section>

          <section className="ct-roster" aria-labelledby="ct-roster-title">
            <div className="ct-section-heading">
              <div>
                <p className="ct-kicker">PERSONAL DEL MÓDULO</p>
                <h2 id="ct-roster-title">Trabajadores</h2>
              </div>
              {!cargando && !errorCarga && (
                <span className="ct-count">{trabajadores.length}</span>
              )}
            </div>
            {cargando ? (
              <p className="ct-empty">Cargando trabajadores…</p>
            ) : !errorCarga && trabajadores.length === 0 ? (
              <p className="ct-empty">Aún no hay trabajadores registrados en este módulo.</p>
            ) : (
              <div className="ct-worker-list">
                {trabajadores.map((trabajador, index) => {
                  const tieneTurno = Boolean(trabajador.hora_inicio && trabajador.hora_fin);
                  return (
                    <article
                      className="ct-worker-card"
                      key={trabajador.email}
                      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                    >
                      <div className="ct-worker-identity">
                        <span className="ct-avatar" aria-hidden="true">
                          {(trabajador.nombre || trabajador.email).charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <h3>{trabajador.nombre}</h3>
                          <p>{trabajador.email}</p>
                        </div>
                      </div>
                      <div className="ct-worker-schedule">
                        {tieneTurno ? (
                          <>
                            <span className="ct-status ct-status-set">Horario activo</span>
                            <strong>{trabajador.hora_inicio} — {trabajador.hora_fin}</strong>
                          </>
                        ) : (
                          <>
                            <span className="ct-status ct-status-open">Sin restricción</span>
                            <strong>Acceso permitido a toda hora</strong>
                          </>
                        )}
                      </div>
                      <div className="ct-worker-actions">
                        <button
                          className="ct-button ct-button-secondary"
                          type="button"
                          disabled={Boolean(ocupado)}
                          onClick={() => editar(trabajador)}
                        >
                          {tieneTurno ? 'Editar' : 'Asignar'}
                        </button>
                        {tieneTurno && (
                          <button
                            className="ct-button ct-button-remove"
                            type="button"
                            disabled={Boolean(ocupado)}
                            onClick={() => quitar(trabajador)}
                          >
                            {ocupado === trabajador.email ? 'Quitando…' : 'Quitar'}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
