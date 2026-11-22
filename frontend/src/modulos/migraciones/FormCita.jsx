// Formulario compartido por "Registro" y "Actualizar"
export default function FormCita({ valores, setValores, onEnviar, enviando, boton }) {
  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });
  return (
    <form className="tarjeta" onSubmit={onEnviar}>
      <label htmlFor="tramite">Trámite</label>
      <select id="tramite" name="tramite" value={valores.tramite} onChange={cambiar}>
        <option>Pasaporte</option>
        <option>Carné de extranjería</option>
        <option>Prórroga de permanencia</option>
      </select>
      <label htmlFor="fecha">Fecha</label>
      <input id="fecha" type="date" name="fecha" value={valores.fecha} onChange={cambiar} required />
      <label htmlFor="hora">Hora</label>
      <input id="hora" type="time" name="hora" value={valores.hora} onChange={cambiar} required />
      <button disabled={enviando}>{enviando ? 'Guardando…' : boton}</button>
    </form>
  );
}
