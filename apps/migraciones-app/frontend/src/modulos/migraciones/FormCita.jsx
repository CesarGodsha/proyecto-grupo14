import './migraciones.css';

export default function FormCita({
  valores,
  setValores,
  onEnviar,
  enviando,
  boton,
  cotizacionCodigo = null,
}) {
  const cambiar = (e) =>
    setValores({ ...valores, [e.target.name]: e.target.value });

  return (
    <form className="mig-form-box" onSubmit={onEnviar}>
      <div className="mig-form-header">
        <span className="mig-form-icon" aria-hidden="true">MI</span>
        <div>
          <span className="mig-form-kicker">SOLICITUD DE CITA · GRUPO 14</span>
          <h2>Completa los datos de tu atención</h2>
          <p>Indica el trámite y registra tu fecha y hora preferidas.</p>
        </div>
      </div>

      {cotizacionCodigo && (
        <div className="mig-form-field">
          <label htmlFor="motivo">Motivo o referencia de la operación</label>
          <input
            id="motivo"
            type="text"
            name="motivo"
            className="mig-input-control"
            value={valores.motivo || ''}
            onChange={cambiar}
          />
          <small>Referencia vinculada a la cotización {cotizacionCodigo}.</small>
        </div>
      )}

      <div className="mig-form-field">
        <label htmlFor="tramite">Tipo de trámite</label>
        <select
          id="tramite"
          name="tramite"
          className="mig-input-control"
          value={valores.tramite}
          onChange={cambiar}
          required
        >
          <option value="Pasaporte">Pasaporte</option>
          <option value="Carné de extranjería">Carné de extranjería</option>
          <option value="Prórroga de permanencia">Prórroga de permanencia</option>
        </select>
      </div>

      <div className="mig-form-field-grid">
        <div className="mig-form-field">
          <label htmlFor="fecha">Fecha preferida</label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            className="mig-input-control"
            value={valores.fecha}
            onChange={cambiar}
            required
          />
        </div>
        <div className="mig-form-field">
          <label htmlFor="hora">Hora preferida</label>
          <input
            id="hora"
            type="time"
            name="hora"
            className="mig-input-control"
            value={valores.hora}
            onChange={cambiar}
            required
          />
        </div>
      </div>

      <div className="mig-form-footer">
        <p>
          La fecha y hora se guardan como preferencia en este módulo; no
          representan disponibilidad del sistema oficial.
        </p>
        <button
          type="submit"
          className="mig-btn-submit"
          disabled={enviando}
        >
          {enviando ? 'Guardando solicitud…' : boton}
        </button>
      </div>
    </form>
  );
}
