import { createContext, useContext, useState } from 'react';
import { api } from '../api/client.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('usuario') || 'null'));

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  }
  function logout() {
    localStorage.clear();
    setUsuario(null);
  }
  const rolDe = (modulo) => usuario?.roles.find((r) => r.modulo === modulo)?.rol;

  return <Ctx.Provider value={{ usuario, login, logout, rolDe }}>{children}</Ctx.Provider>;
}
