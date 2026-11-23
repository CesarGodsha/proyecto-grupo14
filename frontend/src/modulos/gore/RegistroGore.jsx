import { useState } from 'react';
import { api, mensajeDeError } from '../../api/client';

export default function RegistroGore({ usuario }) {
  const [asunto, setAsunto] = useState('');
  const [documento, setDocumento] = useState('solicitud_expediente.pdf');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const registrar = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const { data } = await api.post('/gore', {
        id_usuario: usuario?.id || 1,
        asunto,
        documento
      });
      setResultado(data);
      setAsunto('');
    } catch (err) {
      alert(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="gore-card">
      <h3>Mesa de Partes Virtual — Registro de Expediente</h3>
      <form onSubmit={registrar} className="gore-form">
        <input
          className="gore-input"
          value={usuario?.nombre || 'Administrado'}
          readOnly
        />
        <input
          className="gore-input"
          placeholder="Asunto del trámite (ej. Permiso de transporte de carga pesada)"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          required
        />
        <input
          className="gore-input"
          placeholder="Nombre del archivo adjunto (ej. solicitud_carga.pdf)"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />
        <button className="gore-btn-primary" type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Generar Expediente'}
        </button>
      </form>

      {resultado && (
        <div
          style={{
            marginTop: '1.2rem',
            padding: '1rem 1.2rem',
            background: 'rgba(16, 185, 129, 0.16)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '12px',
            color: '#6ee7b7'
          }}
        >
          <strong>¡Trámite registrado en Neon!</strong> Código de seguimiento:{' '}
          <strong style={{ color: '#fde68a' }}>{resultado.codigo}</strong> — Estado:{' '}
          <span className="text-uppercase">{resultado.estado}</span>
        </div>
      )}
    </div>
  );
}