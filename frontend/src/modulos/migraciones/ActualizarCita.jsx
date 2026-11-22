import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, mensajeDeError } from '../../api/client.js';
import FormCita from './FormCita.jsx';

export default function ActualizarCita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valores, setValores] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/migraciones/citas/mias').then((r) => {
      const c = r.data.find((x) => String(x.id) === id);
      if (c) setValores({ tramite: c.tramite, fecha: c.fecha, hora: c.hora });
      else setError('No encontramos esa cita');
    }).catch((e) => setError(mensajeDeError(e)));
  }, [id]);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      await api.put(`/migraciones/citas/${id}`, valores);
      navigate('/migraciones/consulta');
    } catch (err) {
      setError(mensajeDeError(err));
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>Migraciones › Cambiar cita</h1>
      {error && <p className="error">{error}</p>}
      {valores && <FormCita valores={valores} setValores={setValores} onEnviar={enviar} enviando={enviando} boton="Guardar cambios" />}
    </>
  );
}
