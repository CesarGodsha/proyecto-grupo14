import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import MenuRoles from './components/MenuRoles.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import ModuleFrame from './components/ModuleFrame.jsx';
import Login from './pages/Login.jsx';
import Inicio from './pages/Inicio.jsx';

function Marco() {
  const { pathname } = useLocation();
  const moduloActual = pathname.match(
    /^\/(gore|logistica|migraciones)(\/|$)/
  )?.[1];
  const clasesContenido = moduloActual
    ? `contenido contenido-modulo contenido-modulo-${moduloActual}`
    : 'contenido';
  return (
    <RutaProtegida>
      <MenuRoles moduloActual={moduloActual} />
      <main className={clasesContenido}>
        <Outlet />
      </main>
    </RutaProtegida>
  );
}
const P = ({ modulo, roles, children }) => <RutaProtegida modulo={modulo} roles={roles}>{children}</RutaProtegida>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Marco />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/gore/*" element={<P modulo="gore"><ModuleFrame modulo="gore" /></P>} />
        <Route path="/logistica/*" element={<P modulo="logistica"><ModuleFrame modulo="logistica" /></P>} />
        <Route path="/migraciones/*" element={<P modulo="migraciones"><ModuleFrame modulo="migraciones" /></P>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}