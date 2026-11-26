import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function RegistroGore({ alRegistrar }) {
  const { usuario, rolDe } = useAuth();

  const rolGore =
    (typeof rolDe === 'function' ? rolDe('gore') : null) ||
    (Array.isArray(usuario?.roles)
      ? usuario.roles.find((r) => r.modulo === 'gore')?.rol
      : usuario?.roles?.gore) ||
    'cliente';

  const esStaffGore = rolGore === 'administrador' || rolGore === 'empleado';
  const [administrado, setAdministrado] = useState(usuario?.nombre || '');
  const [asunto, setAsunto] = useState('');
  const [documento, setDocumento] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!esStaffGore && usuario?.nombre) {
      setAdministrado(usuario.nombre);
    }
  }, [esStaffGore, usuario?.nombre]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    if (!asunto.trim()) {
      setError('Escribe el asunto de la solicitud para continuar.');
      return;
    }

    setEnviando(true);
    try {
      await api.post('/gore', {
        administrado: esStaffGore
          ? administrado.trim() || usuario?.nombre || 'Administrado'
          : usuario?.nombre || administrado,
        asunto: asunto.trim(),
        documento: documento.trim() || null,
        id_usuario: usuario?.id,
      });
      setAsunto('');
      setDocumento('');
      if (alRegistrar) alRegistrar();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="gore-card">
      <div className="gore-card-heading">
        <span className="gore-card-heading-icon" aria-hidden="true">
          01
        </span>
        <div>
          <span className="gore-card-kicker">NUEVA SOLICITUD</span>
          <h3>Registrar expediente</h3>
          <p>Completa la información para guardar tu solicitud en el sistema.</p>
        </div>
      </div>
      <form className="gore-form" onSubmit={manejarEnvio}>
        <div className="gore-field">
          <label htmlFor="gore-administrado">Administrado</label>
          <input
            id="gore-administrado"
            className="gore-input"
            value={administrado}
            readOnly={!esStaffGore}
            onChange={(e) => {
              if (esStaffGore) setAdministrado(e.target.value);
            }}
          />
          {!esStaffGore && (
            <small>Este nombre proviene de tu cuenta.</small>
          )}
        </div>
        <div className="gore-field">
          <label htmlFor="gore-asunto">Asunto de la solicitud</label>
          <textarea
            id="gore-asunto"
            className="gore-input"
            placeholder="Describe brevemente el motivo de tu solicitud"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="gore-field">
          <label htmlFor="gore-documento">Referencia del documento (opcional)</label>
          <input
            id="gore-documento"
            className="gore-input"
            placeholder="Ej. solicitud_transporte.pdf"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />
          <small>
            Se guarda el nombre de referencia; este módulo no recibe archivos adjuntos.
          </small>
        </div>
        {error && (
          <p className="gore-form-error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            {error}
          </p>
        )}
        <div className="gore-form-footer">
          <p>
            Al enviar, se generará un expediente que podrás consultar en la
            bandeja de seguimiento.
          </p>
          <button
            type="submit"
            className="gore-btn-primary"
            disabled={enviando}
          >
            {enviando ? 'Registrando…' : 'Registrar solicitud'}
            {!enviando && <span aria-hidden="true">→</span>}
          </button>
        </div>
      </form>
    </section>
  );
}
