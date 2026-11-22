import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Estado from '../../components/Estado.jsx';

export default function PanelAdmin() {
  const { rolDe } = useAuth();
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');
  const cargar = () => api.get('/migraciones/citas').then((r) => setCitas(r.data)).catch((e) => setError(mensajeDeError(e)));
  useEffect(() => { cargar(); }, []);

  const accion = (promesa) => promesa.then(cargar).catch((e) => setError(mensajeDeError(e)));
  const estado = (id, nuevo) => accion(api.patch(`/migraciones/citas/${id}/estado`, { estado: nuevo }));
  const borrar = (id) => accion(api.delete(`/migraciones/citas/${id}`));

  return (
    <>
      <h1>Migraciones › Panel de citas</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead><tr><th>Código</th><th>Ciudadano</th><th>Trámite</th><th>Fecha</th><th>Hora</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td>{c.codigo}</td><td>{c.ciudadano}</td><td>{c.tramite}</td><td>{c.fecha}</td><td>{c.hora}</td>
              <td><Estado valor={c.estado} /></td>
              <td className="acciones">
                <button onClick={() => estado(c.id, 'confirmada')}>Confirmar</button>
                <button onClick={() => estado(c.id, 'rechazado')}>Rechazar</button>
                {rolDe('migraciones') === 'administrador' && <button onClick={() => borrar(c.id)}>Eliminar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
