import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function PanelGore() {
  const { usuario, rolDe } = useAuth();
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(false);

  const rolGore =
    (typeof rolDe === 'function' ? rolDe('gore') : null) ||
    (Array.isArray(usuario?.roles)
      ? usuario.roles.find((r) => r.modulo === 'gore')?.rol
      : usuario?.roles?.gore) ||
    'cliente';

  const esStaffGore = rolGore === 'administrador' || rolGore === 'empleado';

  const cargar = async () => {
    setCargando(true);
    try {
      const { data } = await api.get('/gore');
      setTramites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (esStaffGore) {
      cargar();
    }
  }, [esStaffGore]);

  if (!esStaffGore) {
    return (
      <div className="gore-card">
        <h3>Acceso Restringido</h3>
        <p style={{ color: '#fde68a', marginTop: '0.5rem' }}>
          La Bandeja de Atención y aprobación de expedientes es exclusiva para el personal autorizado del GORE Junín.
        </p>
      </div>
    );
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/gore/${id}`, { estado: nuevoEstado });
      cargar();
    } catch (err) {
      alert(mensajeDeError(err));
    }
  };

  const eliminarTramite = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este expediente?')) return;
    try {
      await api.delete(`/gore/${id}`);
      cargar();
    } catch (err) {
      alert(mensajeDeError(err));
    }
  };

  return (
    <div className="gore-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3>Bandeja de Atención — Gestión de Expedientes</h3>
        <button type="button" className="gore-btn-primary" onClick={cargar}>
          Actualizar Bandeja
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="gore-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Administrado</th>
              <th>Asunto</th>
              <th>Documento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#fde68a' }}>
                  Cargando bandeja...
                </td>
              </tr>
            ) : tramites.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No hay expedientes registrados.
                </td>
              </tr>
            ) : (
              tramites.map((t) => {
                const codigoMostrar = t.codigo || `EXP-${String(t.id).padStart(5, '0')}`;
                const administradoMostrar = t.administrado || `Usuario #${t.id_usuario || 1}`;

                return (
                  <tr key={t.id}>
                    <td><strong>{codigoMostrar}</strong></td>
                    <td>{administradoMostrar}</td>
                    <td>{t.asunto}</td>
                    <td style={{ color: '#93c5fd', fontSize: '0.88rem' }}>
                      {t.documento || 'solicitud.pdf'}
                    </td>
                    <td>
                      <span className={`gore-badge badge-${t.estado}`}>
                        {t.estado}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="gore-tab"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem', borderColor: '#34d399', color: '#6ee7b7' }}
                          onClick={() => cambiarEstado(t.id, 'atendido')}
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          className="gore-tab"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem', borderColor: '#fbbf24', color: '#fde68a' }}
                          onClick={() => cambiarEstado(t.id, 'observado')}
                        >
                          Observar
                        </button>
                        <button
                          type="button"
                          className="gore-tab"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem', borderColor: '#f87171', color: '#fca5a5' }}
                          onClick={() => eliminarTramite(t.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}