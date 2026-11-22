import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import Estado from '../../components/Estado.jsx';

export default function ConsultaCita() {
  const [citas, setCitas] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/migraciones/citas/mias').then((r) => setCitas(r.data)).catch((e) => setError(mensajeDeError(e)));
  }, []);

  return (
    <>
      <h1>Migraciones › Mis citas</h1>
      {error && <p className="error">{error}</p>}
      {citas && !citas.length && <p>Aún no tienes citas. Agenda la primera desde «nueva cita».</p>}
      {citas?.length > 0 && (
        <table>
          <thead><tr><th>Código</th><th>Trámite</th><th>Fecha</th><th>Hora</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id}>
                <td>{c.codigo}</td><td>{c.tramite}</td><td>{c.fecha}</td><td>{c.hora}</td>
                <td><Estado valor={c.estado} /></td>
                <td>{c.estado === 'registrado' && <Link to={`/migraciones/actualizar/${c.id}`}>Cambiar</Link>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
