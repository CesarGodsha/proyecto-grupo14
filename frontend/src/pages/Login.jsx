import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function construirUrlAuthRegister() {
  const raw = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');
  if (!raw || raw === '/api') {
    return '/api/auth/register';
  }
  if (raw.endsWith('/api')) {
    return `${raw}/auth/register`;
  }
  return `${raw}/api/auth/register`;
}

const REGISTER_URL = construirUrlAuthRegister();

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [modo, setModo] = useState('login'); // 'login' | 'registro'

  // Estado de inicio de sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Estado de registro de nuevo cliente
  const [nombreCliente, setNombreCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [passwordCliente, setPasswordCliente] = useState('');
  const [mensajeRegistro, setMensajeRegistro] = useState('');
  const [errorRegistro, setErrorRegistro] = useState('');
  const [registrando, setRegistrando] = useState(false);

  async function manejarLogin(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
          err.response?.data?.error ||
          err.message ||
          'No se pudo iniciar sesión'
      );
    } finally {
      setCargando(false);
    }
  }

  async function manejarRegistroCliente(e) {
    e.preventDefault();
    setErrorRegistro('');
    setMensajeRegistro('');
    setRegistrando(true);

    const nombreLimpio = nombreCliente.trim();
    const correoLimpio = emailCliente.trim().toLowerCase();

    try {
      const resp = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreLimpio,
          email: correoLimpio,
          password: passwordCliente,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(
          data.mensaje ||
            data.error ||
            `No se pudo registrar el nuevo cliente (HTTP ${resp.status}).`
        );
      }

      setMensajeRegistro(
        data.mensaje ||
          `Cliente "${nombreLimpio}" registrado con éxito. Ya puedes iniciar sesión con su correo.`
      );
      setEmail(correoLimpio);
      setPassword(passwordCliente);
      setNombreCliente('');
      setEmailCliente('');
      setPasswordCliente('');
      setModo('login');
    } catch (err) {
      setErrorRegistro(err.message || 'No se pudo registrar el nuevo cliente.');
    } finally {
      setRegistrando(false);
    }
  }

  return (
    <div className="login-escena">
      <div className="login-orbe login-orbe-1" aria-hidden="true" />
      <div className="login-orbe login-orbe-2" aria-hidden="true" />

      <div className="tarjeta login login-animada">
        <div className="login-encabezado">
          <span className="login-badge">Portal Unificado · Junín</span>
          <h1>Grupo 14 · Comercio Exterior Junín</h1>
          <p className="login-subtitulo">
            Un solo acceso para LogísticaMax, GORE y Migraciones.
          </p>
        </div>

        <div className="login-tabs" role="tablist" aria-label="Opciones de acceso">
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'login'}
            className={`login-tab ${modo === 'login' ? 'activo' : ''}`}
            onClick={() => {
              setModo('login');
              setError('');
            }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'registro'}
            className={`login-tab ${modo === 'registro' ? 'activo' : ''}`}
            onClick={() => {
              setModo('registro');
              setErrorRegistro('');
              setMensajeRegistro('');
            }}
          >
            Registrar cliente
          </button>
        </div>

        {mensajeRegistro && (
          <p className="exito login-alerta-exito">{mensajeRegistro}</p>
        )}

        {modo === 'login' ? (
          <form onSubmit={manejarLogin} className="login-form">
            <div className="campo-grupo">
              <label htmlFor="login-email">Correo</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.pe"
                required
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="error login-alerta-error">{error}</p>}

            <button
              type="submit"
              className="btn-principal-login"
              disabled={cargando}
            >
              {cargando ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form onSubmit={manejarRegistroCliente} className="login-form">
            <div className="campo-grupo">
              <label htmlFor="reg-nombre">Nombre completo del cliente</label>
              <input
                id="reg-nombre"
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Ej. María Quispe Rojas"
                required
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="reg-email">Correo electrónico</label>
              <input
                id="reg-email"
                type="email"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
                placeholder="cliente.nuevo@correo.pe"
                required
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="reg-password">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                value={passwordCliente}
                onChange={(e) => setPasswordCliente(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            {errorRegistro && (
              <p className="error login-alerta-error">{errorRegistro}</p>
            )}

            <button
              type="submit"
              className="btn-principal-login"
              disabled={registrando}
            >
              {registrando ? 'Registrando cliente…' : 'Crear cuenta de cliente'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}