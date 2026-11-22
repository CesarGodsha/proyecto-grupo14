import { useState } from 'react';
import { api, mensajeDeError } from '../../api/client.js';
import FormCita from './FormCita.jsx';

export default function RegistroCita() {
  const [valores, setValores] = useState({ tramite: 'Pasaporte', fecha: '', hora: '' });
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      const { data } = await api.post('/migraciones/citas', valores);
      setAviso({ ok: true, texto: `Cita registrada · ${data.codigo}` });
    } catch (err) {
      setAviso({ ok: false, texto: mensajeDeError(err) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>Migraciones › Nueva cita</h1>
      {aviso && <p className={aviso.ok ? 'exito' : 'error'}>{aviso.texto}</p>}
      <FormCita valores={valores} setValores={setValores} onEnviar={enviar} enviando={enviando} boton="Agendar cita" />
    </>
  );
}
