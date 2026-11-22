import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import FondoAnimadoLogistica from './FondoAnimadoLogistica.jsx';
import RutaCamionAnimado from './RutaCamionAnimado.jsx';
import './logistica.css';

const RUTAS_FRECUENTES = [
  'Huancayo → Puerto del Callao',
  'Huancayo → Puerto de Arica (Chile)',
  'La Oroya → Puerto de Matarani',
  'Tarma → Lima (Terminal Terrestre)',
];

export default function RegistroCarga() {
  const { usuario } = useAuth();
  const nav = useNavigate();

  const [cliente, setCliente] = useState(usuario?.nombre || '');
  const [ruta, setRuta] = useState('');
  const [carga, setCarga] = useState('');
  const [toneladas, setToneladas] = useState(5);
  const [matpel, setMatpel] = useState(false);
  const [idTramite, setIdTramite] = useState('');
  const [permisosGore, setPermisosGore] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api.get('/logistica/permisos-gore')
      .then((r) => setPermisosGore(r.data))
      .catch(() => {});
  }, []);

  const t = Math.max(0.1, Number(toneladas) || 1);
  const extraTon = Math.max(0, t - 5) * 80;
  const subtotal = 450 + extraTon;
  const recargoMatpel = matpel ? subtotal * 0.2 : 0;
  const total = (subtotal + recargoMatpel).toFixed(2);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const { data } = await api.post('/logistica/cotizaciones', {
        cliente,
        ruta,
        carga,
        toneladas: Number(toneladas),
        matpel,
        id_tramite: idTramite || null,
      });
      setExito(`Cotización ${data.codigo} registrada por S/ ${data.monto_calculado}. Redirigiendo a tus viajes...`);
      setTimeout(() => nav('/logistica/consulta'), 1300);
    } catch (err) {
      setError(mensajeDeError(err));
      setGuardando(false);
    }
  };

  return (
    <div className="log-container">
      <FondoAnimadoLogistica />
      <div className="log-hero">
        <div>
          <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
            LOGÍSTICAMAX › COTIZAR CARGA
          </div>
          <h1>LogísticaMax Perú · Cotizador de Carga</h1>
          <p>Transporte internacional terrestre Huancayo – Corredor Pacífico (Tarifario Caso 35)</p>
        </div>
        <div className="log-live-pill">
          <span className="log-dot" />
          <span>FLOTA ACTIVA 24/7</span>
        </div>
      </div>

      <RutaCamionAnimado origen="ORIGEN · REGIÓN JUNÍN" destino={ruta ? ruta.toUpperCase() : 'DESTINO INTERNACIONAL'} />

      {exito && <div className="log-toast">✓ {exito}</div>}
      {error && <p className="error">{error}</p>}

      <div className="log-grid-form">
        <form onSubmit={enviar} className="log-card">
          <div className="log-field">
            <label>Cliente / Empresa Exportadora</label>
            <input className="log-input" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
          </div>

          <div className="log-field">
            <label>Ruta Internacional (Origen → Destino)</label>
            <input className="log-input" placeholder="Selecciona abajo o escribe la ruta..." value={ruta} onChange={(e) => setRuta(e.target.value)} required />
            <div className="log-rutas-rapidas">
              {RUTAS_FRECUENTES.map((r) => (
                <button type="button" key={r} className="log-chip" onClick={() => setRuta(r)}>{r}</button>
              ))}
            </div>
          </div>

          <div className="log-field">
            <label>Descripción de la Mercancía</label>
            <input className="log-input" placeholder="Ej. 12 toneladas de café orgánico en sacos" value={carga} onChange={(e) => setCarga(e.target.value)} required />
          </div>

          <div className="log-field">
            <label>Peso Total (Toneladas métricas)</label>
            <input className="log-input" type="number" step="0.1" min="0.5" value={toneladas} onChange={(e) => setToneladas(e.target.value)} required />
          </div>

          <label className={`log-matpel-box ${matpel ? 'activo' : ''}`}>
            <input type="checkbox" checked={matpel} onChange={(e) => setMatpel(e.target.checked)} />
            <div>
              <strong>Carga Peligrosa / MATPEL (+20%)</strong>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Aplica protocolo especial y recargo normativo sobre el flete</div>
            </div>
          </label>

          <div className="log-field">
            <label>Permiso GORE Junín (Requerido para confirmar despacho)</label>
            <select className="log-select" value={idTramite} onChange={(e) => setIdTramite(e.target.value)}>
              <option value="">-- Vincular expediente GORE (opcional al registrar) --</option>
              {permisosGore.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codigo} · {p.asunto} [{p.estado}]
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="log-btn-primary" disabled={guardando}>
            {guardando ? 'Registrando solicitud...' : 'Generar Cotización Oficial →'}
          </button>
        </form>

        <div className="log-tarifa-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', fontWeight: 700 }}>
              Simulador de Tarifa en Vivo
            </span>
            <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>● EN LÍNEA</span>
          </div>
          <div className="log-tarifa-monto">S/ {total}</div>
          <div className="log-desglose">
            <div><span>Flete base (hasta 5.0 t)</span><span>S/ 450.00</span></div>
            <div><span>Exceso peso ({Math.max(0, t - 5).toFixed(1)} t × S/ 80)</span><span>S/ {extraTon.toFixed(2)}</span></div>
            <div><span>Recargo MATPEL (20%)</span><span>S/ {recargoMatpel.toFixed(2)}</span></div>
          </div>
          <div style={{ marginTop: '18px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong>Ruta seleccionada:</strong> {ruta || 'Pendiente de definir'}<br />
            <strong>Modalidad:</strong> {matpel ? 'Transporte Especial MATPEL' : 'Carga General Consolidada'}
          </div>
        </div>
      </div>
    </div>
  );
}