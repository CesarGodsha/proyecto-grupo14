import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../../api/client';

export default function ConsultaGore() {
  const [todosTramites, setTodosTramites] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarTramites = async () => {
    setCargando(true);
    try {
      const { data } = await api.get('/gore');
      setTodosTramites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTramites();
  }, []);

  const tramitesFiltrados = todosTramites.filter((t) => {
    const codigo = (t.codigo || `EXP-${String(t.id).padStart(5, '0')}`).toLowerCase();
    const admin = (t.administrado || `Usuario #${t.id_usuario || 1}`).toLowerCase();
    const asunto = (t.asunto || '').toLowerCase();
    const idTexto = String(t.id);
    const term = busqueda.trim().toLowerCase();

    const coincideTexto =
      !term ||
      idTexto.includes(term) ||
      codigo.includes(term) ||
      admin.includes(term) ||
      asunto.includes(term);

    const coincideEstado = !filtroEstado || t.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  return (
    <div className="gore-card">
      <h3>Consulta Pública de Expedientes — Mesa de Partes GORE Junín</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <input
          className="gore-input"
          style={{ flex: '1 1 280px' }}
          placeholder="Buscar por número (30), código (EXP-00030), administrado o asunto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="button" className="gore-btn-primary" onClick={cargarTramites}>
          Actualizar Lista
        </button>
        {(busqueda || filtroEstado) && (
          <button
            type="button"
            className="gore-tab"
            onClick={() => {
              setBusqueda('');
              setFiltroEstado('');
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
        {[
          { label: 'Todos', value: '' },
          { label: 'Registrados', value: 'registrado' },
          { label: 'Atendidos (Aprobados)', value: 'atendido' },
          { label: 'Observados', value: 'observado' }
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            className={`gore-tab ${filtroEstado === f.value ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
            onClick={() => setFiltroEstado(f.value)}
          >
            {f.label}
          </button>
        ))}
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
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#fde68a' }}>
                  Consultando expedientes...
                </td>
              </tr>
            ) : tramitesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>
                  No se encontraron expedientes con ese criterio.
                </td>
              </tr>
            ) : (
              tramitesFiltrados.map((t) => {
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