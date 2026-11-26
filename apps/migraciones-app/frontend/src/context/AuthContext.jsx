import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { iniciarSesion } from '../api/auth.js';
import { setApiToken } from '../api/client.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

function leerUsuarioGuardado() {
  try {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!token || !usuario) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      return null;
    }
    return usuario;
  } catch {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    return null;
  }
}

export function AuthProvider({ children, session }) {
  const [usuarioLocal, setUsuarioLocal] = useState(leerUsuarioGuardado);
  const [tokenLocal, setTokenLocal] = useState(
    () => localStorage.getItem('token') || ''
  );
  const usuario = session?.usuario || usuarioLocal;
  const token = session?.token || tokenLocal;

  useEffect(() => {
    setApiToken(token);
  }, [token]);

  const login = useCallback(async (email, password) => {
    const data = await iniciarSesion(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setApiToken(data.token);
    setTokenLocal(data.token);
    setUsuarioLocal(data.usuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setApiToken(null);
    setTokenLocal('');
    setUsuarioLocal(null);
  }, []);

  const rolDe = useCallback((modulo) => {
    if (Array.isArray(usuario?.roles)) {
      return usuario.roles.find((r) => r.modulo === modulo)?.rol;
    }
    const rol = usuario?.roles?.[modulo];
    return typeof rol === 'object' ? rol?.rol : rol;
  }, [usuario]);

  const value = useMemo(
    () => ({ usuario, token, login, logout, rolDe }),
    [usuario, token, login, logout, rolDe]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
