import { useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext.jsx';
import { setApiToken } from '../api/client.js';

const MODULE_READY = 'GRUPO14_MODULE_READY';
const PORTAL_AUTH = 'GRUPO14_PORTAL_AUTH';

function origenDelPortal() {
  return (
    import.meta.env.VITE_PORTAL_ORIGIN ||
    (import.meta.env.DEV ? 'http://localhost:5173' : '')
  );
}

export default function ModuleAuthBridge({ children }) {
  const [session, setSession] = useState(null);
  const portalOrigin = origenDelPortal();

  useEffect(() => {
    if (!portalOrigin || window.parent === window) return undefined;

    const recibirSesion = (event) => {
      if (event.origin !== portalOrigin || event.source !== window.parent) {
        return;
      }

      if (event.data?.type === PORTAL_AUTH) {
        const { token, usuario } = event.data;
        if (
          typeof token !== 'string' ||
          !token ||
          !usuario ||
          !Array.isArray(usuario.roles)
        ) {
          return;
        }
        setApiToken(token);
        setSession({ token, usuario });
      }
    };

    window.addEventListener('message', recibirSesion);
    window.parent.postMessage({ type: MODULE_READY }, portalOrigin);

    return () => {
      window.removeEventListener('message', recibirSesion);
      setApiToken(null);
    };
  }, [portalOrigin]);

  if (!portalOrigin) {
    return (
      <p role="alert">
        Falta configurar VITE_PORTAL_ORIGIN para autenticar este módulo.
      </p>
    );
  }

  if (!session) {
    return (
      <main className="module-auth-pending">
        <p>Conectando de forma segura con el portal…</p>
        <a href={import.meta.env.VITE_PORTAL_URL || 'http://localhost:5173'}>
          Abrir portal de acceso
        </a>
      </main>
    );
  }

  return <AuthProvider session={session}>{children}</AuthProvider>;
}
