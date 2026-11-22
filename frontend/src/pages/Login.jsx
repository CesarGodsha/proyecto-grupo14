import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { mensajeDeError } from '../api/client.js';

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  if (usuario) return <Navigate to="/" replace />;

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="tarjeta login" onSubmit={enviar}>
      <h1>Grupo 14 · Comercio Exterior Junín</h1>
      <p>Un solo acceso para LogísticaMax, GORE y Migraciones.</p>
      <label htmlFor="email">Correo</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="password">Contraseña</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="error">{error}</p>}
      <button disabled={enviando}>{enviando ? 'Ingresando…' : 'Ingresar'}</button>
    </form>
  );
}
