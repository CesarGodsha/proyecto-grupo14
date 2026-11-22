import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Estado from '../../components/Estado.jsx';
import FondoAnimadoLogistica from './FondoAnimadoLogistica.jsx';
import RutaCamionAnimado from './RutaCamionAnimado.jsx';
import './logistica.css';

export default function PanelLogistica() {
  const { rolDe } = useAuth();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const cargar = () => {
    setError('');
    api.get('/logistica/cotizaciones')
      .then((r) => setCotizaciones(r.data))
      .catch((e) => setError(mensajeDeError(e)));
  };

  useEffect(() => { cargar(); }, []);

  const mostrarAviso = (texto) => {
    setAviso(texto);
    setTimeout(() => setAviso(''), 3000);
  };

  const cambiarEstado = (id, nuevo) => {
    setError('');
    api.patch(`/logistica/cotizaciones/${id}/estado`, { estado: nuevo })
      .then(() => {
        mostrarAviso(`Estado actualizado a "${nuevo.replace('_', ' ')}"`);
        cargar();
      })
      .catch((e) => setError(mensajeDeError(e)));
  };

  const eliminar = (id) => {
    if (!confirm('¿Eliminar esta cotización permanentemente?')) return;
    api.delete(`/logistica/cotizaciones/${id}`)
      .then(() => {
        mostrarAviso('Cotización eliminada del sistema');
        cargar();
      })
      .catch((e) => setError(mensajeDeError(e)));
  };

  const totalIngresos = cotizaciones.reduce((acc, c) => acc + Number(c.monto_calculado || 0), 0);
  const confirmadas = cotizaciones.filter((c) => c.estado === 'confirmada' || c.estado === 'en_transito').length;

  return (
    <div className="log-container">
      <FondoAnimadoLogistica />
      <div className="log-hero">
        <div>
          <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
            LOGÍSTICAMAX › PANEL OPERATIVO
          </div>
          <h1>Panel Operativo · LogísticaMax Perú</h1>
          <p>Control de despachos, validación de permisos GORE (HU-14.2) y citas fronterizas (HU-14.4)</p>
        </div>
        <div className="log-live-pill">
          <span className="log-dot" />
          <span>OPERACIONES · {rolDe('logistica')?.toUpperCase()}</span>
        </div>
      </div>

      <RutaCamionAnimado origen="TORRE DE CONTROL CENTRAL" destino="DESPACHO INTERNACIONAL EN RUTA" />

      <div className="log-stats">
        <div className="log-stat-box"><span>Total Cotizaciones</span><strong>{cotizaciones.length}</strong></div>
        <div className="log-stat-box"><span>Confirmadas / En Ruta</span><strong>{confirmadas}</strong></div>
        <div className="log-stat-box"><span>Facturación Estimada</span><strong>S/ {totalIngresos.toFixed(2)}</strong></div>
      </div>

      {aviso && <div className="log-toast">✓ {aviso}</div>}
      {error && <p className="error">{error}</p>}

      <div className="log-table-wrap">
        <table className="log-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Ruta / Carga</th>
              <th>Tarifa</th>
              <th>Permiso GORE</th>
              <th>Cita Migraciones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No hay cargas registradas aún.</td></tr>
            ) : cotizaciones.map((c) => (
              <tr key={c.id}>
                <td><span className="log-pill">{c.codigo}</span></td>
                <td><strong>{c.cliente}</strong></td>
                <td>
                  <div>{c.ruta}</div>
                  <small style={{ color: '#94a3b8' }}>{c.carga} ({c.toneladas} t)</small>
                  {c.matpel && <span className="log-pill log-pill-matpel">MATPEL</span>}
                </td>
                <td><strong>S/ {Number(c.monto_calculado).toFixed(2)}</strong></td>
                <td>{c.codigo_tramite ? <><strong>{c.codigo_tramite}</strong> <Estado valor={c.estado_tramite} /></> : <span style={{ color: '#94a3b8' }}>Sin permiso</span>}</td>
                <td>{c.codigo_cita ? <><strong>{c.codigo_cita}</strong> <Estado valor={c.estado_cita} /></> : <span style={{ color: '#94a3b8' }}>Sin cita</span>}</td>
                <td><Estado valor={c.estado} /></td>
                <td className="log-actions">
                  <button className="log-btn-sm log-btn-ok" onClick={() => cambiarEstado(c.id, 'confirmada')}>Confirmar</button>
                  <button className="log-btn-sm log-btn-info" onClick={() => cambiarEstado(c.id, 'en_transito')}>En Tránsito</button>
                  <button className="log-btn-sm" onClick={() => cambiarEstado(c.id, 'entregado')}>Entregado</button>
                  <button className="log-btn-sm log-btn-warn" onClick={() => cambiarEstado(c.id, 'rechazado')}>Rechazar</button>
                  {rolDe('logistica') === 'administrador' && (
                    <button className="log-btn-sm log-btn-del" onClick={() => eliminar(c.id)}>Eliminar</button>
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