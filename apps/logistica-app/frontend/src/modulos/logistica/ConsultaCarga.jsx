import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Estado from '../../components/Estado.jsx';
import RutaCamionAnimado from './RutaCamionAnimado.jsx';
import './logistica.css';

export default function ConsultaCarga() {
  const { rolDe } = useAuth();
  const nav = useNavigate();
  const [lista, setLista] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/logistica/cotizaciones/mias')
      .then((r) => setLista(r.data))
      .catch((e) => setError(mensajeDeError(e)));
  }, []);

  const irAMigraciones = (cot) => {
    nav(`/migraciones/registro?id_cotizacion=${cot.id}&codigo=${cot.codigo}`);
  };

  return (
    <div className="log-container">
      <div className="log-hero">
        <div>
          <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
            LOGÍSTICAMAX › MIS VIAJES Y DESPACHOS
          </div>
          <h1>Mis Cotizaciones y Despachos</h1>
          <p>Seguimiento en tiempo real de cargas, permisos GORE y control migratorio</p>
        </div>
        {rolDe('logistica') === 'cliente' && (
          <Link to="/logistica/registro" className="log-btn-sm" style={{ padding: '10px 16px' }}>
            + Nueva Cotización
          </Link>
        )}
      </div>

      <RutaCamionAnimado origen="SEGUIMIENTO DE FLOTA" destino="CONTROL ADUANERO Y MIGRACIONES" />

      {error && <p className="error">{error}</p>}

      <div className="log-table-wrap">
        <table className="log-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Ruta</th>
              <th>Carga</th>
              <th>Tarifa</th>
              <th>Permiso GORE</th>
              <th>Cita Migraciones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Aún no tienes cotizaciones registradas.</td></tr>
            ) : lista.map((c) => (
              <tr key={c.id}>
                <td><span className="log-pill">{c.codigo}</span></td>
                <td><strong>{c.ruta}</strong></td>
                <td>
                  {c.carga} ({c.toneladas} t)
                  {c.matpel && <span className="log-pill log-pill-matpel">MATPEL</span>}
                </td>
                <td><strong>S/ {Number(c.monto_calculado).toFixed(2)}</strong></td>
                <td>{c.codigo_tramite ? `${c.codigo_tramite} (${c.estado_tramite})` : '—'}</td>
                <td>{c.codigo_cita ? `${c.codigo_cita} (${c.estado_cita})` : '—'}</td>
                <td><Estado valor={c.estado} /></td>
                <td className="log-actions">
                  {c.estado === 'registrado' && (
                    <Link className="log-btn-sm log-btn-info" to={`/logistica/actualizar/${c.id}`}>Editar</Link>
                  )}
                  {rolDe('migraciones') === 'cliente' && !c.id_cita && c.estado === 'confirmada' && (
                    <button className="log-btn-sm log-btn-ok" onClick={() => irAMigraciones(c)}>Agendar cita</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}