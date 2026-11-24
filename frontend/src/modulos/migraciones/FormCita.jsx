import './migraciones.css';

// Formulario compartido por "Registro" y "Actualizar"
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
      <div className="mig-form-header d-flex align-items-center gap-3 mb-4 p-3 rounded-3">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=300&q=80"
          alt="Trámite migratorio"
          className="mig-form-thumb"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="min-w-0">
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle mb-1">
            <i className="bi bi-file-earmark-medical me-1"></i> Formulario Oficial
          </span>
          <h6 className="m-0 fw-bold text-dark">
            Completa los datos de tu atención
          </h6>
          <small className="text-muted d-block">
            Selecciona el tipo de trámite, día y hora disponible
          </small>
        </div>
      </div>

      {cotizacionCodigo && (
        <div className="mb-3">
          <label
            htmlFor="motivo"
            className="form-label fw-bold text-dark d-flex align-items-center gap-2"
          >
            <i className="bi bi-link-45deg text-danger"></i>
            <span>Motivo / Referencia precargada</span>
          </label>
          <input
            id="motivo"
            type="text"
            name="motivo"
            className="form-control mig-input-control"
            value={valores.motivo || ''}
            onChange={cambiar}
          />
        </div>
      )}

      <div className="mb-3">
        <label
          htmlFor="tramite"
          className="form-label fw-bold text-dark d-flex align-items-center gap-2"
        >
          <i className="bi bi-passport text-danger"></i>
          <span>Tipo de trámite migratorio</span>
        </label>
        <select
          id="tramite"
          name="tramite"
          className="form-select mig-input-control"
          value={valores.tramite}
          onChange={cambiar}
        >
          <option value="Pasaporte">Pasaporte</option>
          <option value="Carné de extranjería">Carné de extranjería</option>
          <option value="Prórroga de permanencia">Prórroga de permanencia</option>
        </select>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6">
          <label
            htmlFor="fecha"
            className="form-label fw-bold text-dark d-flex align-items-center gap-2"
          >
            <i className="bi bi-calendar-event text-danger"></i>
            <span>Fecha de cita</span>
          </label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            className="form-control mig-input-control"
            value={valores.fecha}
            onChange={cambiar}
            required
          />
        </div>

        <div className="col-sm-6">
          <label
            htmlFor="hora"
            className="form-label fw-bold text-dark d-flex align-items-center gap-2"
          >
            <i className="bi bi-clock-history text-danger"></i>
            <span>Horario preferido</span>
          </label>
          <input
            id="hora"
            type="time"
            name="hora"
            className="form-control mig-input-control"
            value={valores.hora}
            onChange={cambiar}
            required
          />
        </div>
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn mig-btn-submit d-flex align-items-center justify-content-center gap-2 py-2"
          disabled={enviando}
        >
          {enviando ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span>Guardando…</span>
            </>
          ) : (
            <>
              <i className="bi bi-check2-circle fs-5"></i>
              <span>{boton}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}