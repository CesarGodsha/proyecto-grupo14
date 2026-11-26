import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import RutaCamionAnimado from './RutaCamionAnimado.jsx';
import './logistica.css';

export default function ActualizarCarga() {
  const { id } = useParams();
  const nav = useNavigate();

  const [cliente, setCliente] = useState('');
  const [ruta, setRuta] = useState('');
  const [carga, setCarga] = useState('');
  const [toneladas, setToneladas] = useState(5);
  const [matpel, setMatpel] = useState(false);
  const [idTramite, setIdTramite] = useState('');
  const [permisosGore, setPermisosGore] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/logistica/permisos-gore')
      .then((r) => setPermisosGore(r.data))
      .catch((e) => setError(mensajeDeError(e)));
    api.get('/logistica/cotizaciones/mias')
      .then((r) => {
        const item = r.data.find((x) => String(x.id) === String(id));
        if (item) {
          setCliente(item.cliente || '');
          setRuta(item.ruta || '');
          setCarga(item.carga || '');
          setToneladas(item.toneladas || 5);
          setMatpel(Boolean(item.matpel));
          setIdTramite(item.id_tramite || '');
        }
      })
      .catch((e) => setError(mensajeDeError(e)));
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/logistica/cotizaciones/${id}`, {
        cliente,
        ruta,
        carga,
        toneladas: Number(toneladas),
        matpel,
        id_tramite: idTramite || null,
      });
      nav('/logistica/consulta');
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <div className="log-container">
      <div className="log-hero">
        <div>
          <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
            LOGÍSTICAMAX › ACTUALIZAR COTIZACIÓN
          </div>
          <h1>Actualizar Cotización #{id}</h1>
          <p>Modifica ruta, tonelaje o vincula tu expediente aprobado del GORE Junín</p>
        </div>
      </div>

      <RutaCamionAnimado origen="EDICIÓN DE EXPEDIENTE" destino="VALIDACIÓN GORE JUNÍN" />

      {error && <p className="error">{error}</p>}

      <form onSubmit={guardar} className="log-card" style={{ maxWidth: '560px' }}>
        <div className="log-field">
          <label>Cliente / Empresa</label>
          <input className="log-input" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
        </div>
        <div className="log-field">
          <label>Ruta</label>
          <input className="log-input" value={ruta} onChange={(e) => setRuta(e.target.value)} required />
        </div>
        <div className="log-field">
          <label>Carga</label>
          <input className="log-input" value={carga} onChange={(e) => setCarga(e.target.value)} required />
        </div>
        <div className="log-field">
          <label>Toneladas</label>
          <input className="log-input" type="number" step="0.1" min="0.5" value={toneladas} onChange={(e) => setToneladas(e.target.value)} required />
        </div>
        <label className={`log-matpel-box ${matpel ? 'activo' : ''}`}>
          <input type="checkbox" checked={matpel} onChange={(e) => setMatpel(e.target.checked)} />
          <strong>Carga Peligrosa / MATPEL (+20%)</strong>
        </label>
        <div className="log-field">
          <label>Permiso GORE Junín</label>
          <select className="log-select" value={idTramite} onChange={(e) => setIdTramite(e.target.value)}>
            <option value="">-- Sin permiso asociado --</option>
            {permisosGore.map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo} · {p.asunto} [{p.estado}]
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="log-btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
}