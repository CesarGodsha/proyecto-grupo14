import { useAuth } from '../context/AuthContext.jsx';

export default function Inicio() {
  const { usuario } = useAuth();
  return (
    <section className="tarjeta">
      <h1>Hola, {usuario.nombre}</h1>
      <p>Tus roles en este sistema:</p>
      <ul>{usuario.roles.map((r) => <li key={r.modulo}>{r.modulo}: <b>{r.rol}</b></li>)}</ul>
    </section>
  );
}
