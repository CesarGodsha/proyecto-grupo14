import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const FRONTENDS = {
  gore: import.meta.env.VITE_GORE_FRONTEND_URL || 'http://localhost:5174',
  logistica: import.meta.env.VITE_LOGISTICA_FRONTEND_URL || 'http://localhost:5175',
  migraciones:
    import.meta.env.VITE_MIGRACIONES_FRONTEND_URL || 'http://localhost:5176',
};

const MODULE_READY = 'GRUPO14_MODULE_READY';
const PORTAL_AUTH = 'GRUPO14_PORTAL_AUTH';
const PORTAL_NAVIGATE = 'GRUPO14_PORTAL_NAVIGATE';

export default function ModuleFrame({ modulo }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { token, usuario } = useAuth();
  const frameRef = useRef(null);
  const baseUrl = FRONTENDS[modulo];
  let origin = '';

  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return (
      <p className="error" role="alert">
        La URL configurada para el módulo {modulo} no es válida.
      </p>
    );
  }

  const enviarSesion = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: PORTAL_AUTH, token, usuario },
      origin
    );
  }, [origin, token, usuario]);

  useEffect(() => {
    const manejarMensaje = (event) => {
      if (
        event.origin !== origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== MODULE_READY
      ) {
        return;
      }
      enviarSesion();
    };

    window.addEventListener('message', manejarMensaje);
    return () => window.removeEventListener('message', manejarMensaje);
  }, [enviarSesion, origin]);

  useEffect(() => {
    const manejarNavegacion = (event) => {
      if (
        event.origin !== origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== PORTAL_NAVIGATE ||
        typeof event.data.path !== 'string' ||
        !/^\/migraciones\/registro(?:\?.*)?$/.test(event.data.path)
      ) {
        return;
      }

      const destino = new URL(event.data.path, window.location.origin);
      if (
        destino.origin !== window.location.origin ||
        destino.pathname !== '/migraciones/registro'
      ) {
        return;
      }

      navigate(`${destino.pathname}${destino.search}`);
    };

    window.addEventListener('message', manejarNavegacion);
    return () => window.removeEventListener('message', manejarNavegacion);
  }, [navigate, origin]);

  const hash = `${pathname}${search}`;
  const src = `${baseUrl.replace(/\/+$/, '')}/#${hash}`;

  return (
    <div className="modulo-remoto">
      <iframe
        ref={frameRef}
        key={`${modulo}:${hash}`}
        src={src}
        title={`Módulo ${modulo}`}
        onLoad={enviarSesion}
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
