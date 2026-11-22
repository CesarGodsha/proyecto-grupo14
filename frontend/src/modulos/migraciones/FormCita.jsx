import './migraciones.css';

// Formulario compartido por "Registro" y "Actualizar"
export default function FormCita({ valores, setValores, onEnviar, enviando, boton }) {
  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  return (
    <form className="tarjeta mig-form-box" onSubmit={onEnviar}>
      <div className="mig-form-header d-flex align-items-center gap-3 mb-4 p-3 rounded-3">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=300&q=80"
          alt="Trámite migratorio"
          className="mig-form-thumb"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div>
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle mb-1">
            <i className="bi bi-file-earmark-medical me-1"></i> Formulario Oficial
          </span>
          <h6 className="m-0 fw-bold text-dark">Completa los datos de tu atención</h6>
          <small className="text-muted">Selecciona el tipo de trámite, día y hora disponible</small>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="tramite" className="form-label fw-bold text-dark d-flex align-items-center gap-2">
          <i className="bi bi-passport text-danger"></i>
          <span>Tipo de trámite migratorio</span>
        </label>
        <select
          id="tramite"
          name="tramite"
          className="form-select form-select-lg mig-input-control"
          value={valores.tramite}
          onChange={cambiar}
        >
          <option value="Pasaporte">Pasaporte</option>
          <option value="Carné de extranjería">Carné de extranjería</option>
          <option value="Prórroga de permanencia">Prórroga de permanencia</option>
        </select>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label htmlFor="fecha" className="form-label fw-bold text-dark d-flex align-items-center gap-2">
            <i className="bi bi-calendar-event text-danger"></i>
            <span>Fecha de cita</span>
          </label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            className="form-control form-control-lg mig-input-control"
            value={valores.fecha}
            onChange={cambiar}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="hora" className="form-label fw-bold text-dark d-flex align-items-center gap-2">
            <i className="bi bi-clock-history text-danger"></i>
            <span>Horario preferido</span>
          </label>
          <input
            id="hora"
            type="time"
            name="hora"
            className="form-control form-control-lg mig-input-control"
            value={valores.hora}
            onChange={cambiar}
            required
          />
        </div>
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-lg mig-btn-submit d-flex align-items-center justify-content-center gap-2"
          disabled={enviando}
        >
          {enviando ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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