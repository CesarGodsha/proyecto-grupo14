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
  const [documento, setDocumento] = useState('solicitud_expediente.pdf');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!esStaffGore && usuario?.nombre) {
      setAdministrado(usuario.nombre);
    }
  }, [esStaffGore, usuario?.nombre]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!asunto.trim()) return alert('Ingresa el asunto del trámite.');

    setEnviando(true);
    try {
      await api.post('/gore', {
        administrado: esStaffGore
          ? administrado.trim() || usuario?.nombre || 'Administrado'
          : usuario?.nombre || administrado,
        asunto: asunto.trim(),
        documento: documento.trim() || 'solicitud_expediente.pdf',
        id_usuario: usuario?.id
      });
      setAsunto('');
      if (alRegistrar) alRegistrar();
    } catch (err) {
      alert(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="gore-card">
      <h3>Mesa de Partes Virtual — Registro de Expediente</h3>
      <form className="gore-form" onSubmit={manejarEnvio}>
        <input
          className="gore-input"
          placeholder="Administrado"
          value={administrado}
          readOnly={!esStaffGore}
          style={!esStaffGore ? { opacity: 0.78, cursor: 'not-allowed' } : undefined}
          onChange={(e) => {
            if (esStaffGore) setAdministrado(e.target.value);
          }}
        />
        <input
          className="gore-input"
          placeholder="Asunto del trámite (ej. Permiso de transporte regional)"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          required
        />
        <input
          className="gore-input"
          placeholder="Nombre del documento PDF"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />
        <button type="submit" className="gore-btn-primary" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Generar Expediente'}
        </button>
      </form>
    </div>
  );
}