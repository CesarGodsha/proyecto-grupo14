import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MenuRoles from './components/MenuRoles.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Inicio from './pages/Inicio.jsx';
import GoreInicio from './modulos/gore/Inicio.jsx';
import RegistroGore from './modulos/gore/RegistroGore.jsx';
import ConsultaGore from './modulos/gore/ConsultaGore.jsx';
import PanelGore from './modulos/gore/PanelGore.jsx';
import RegistroCarga from './modulos/logistica/RegistroCarga.jsx';
import ConsultaCarga from './modulos/logistica/ConsultaCarga.jsx';
import ActualizarCarga from './modulos/logistica/ActualizarCarga.jsx';
import PanelLogistica from './modulos/logistica/PanelLogistica.jsx';
import RegistroCita from './modulos/migraciones/RegistroCita.jsx';
import ConsultaCita from './modulos/migraciones/ConsultaCita.jsx';
import ActualizarCita from './modulos/migraciones/ActualizarCita.jsx';
import PanelAdmin from './modulos/migraciones/PanelAdmin.jsx';

function Marco() {
  return (
    <RutaProtegida>
      <MenuRoles />
      <main className="contenido"><Outlet /></main>
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
        <Route path="/gore" element={<P modulo="gore"><GoreInicio /></P>} />
        <Route path="/gore/registro" element={<P modulo="gore"><RegistroGore /></P>} />
        <Route path="/gore/consulta" element={<P modulo="gore"><ConsultaGore /></P>} />
        <Route path="/gore/panel" element={<P modulo="gore" roles={['administrador', 'empleado']}><PanelGore /></P>} />

        {/* Rutas protegidas de LogisticaMax Peru */}
        <Route path="/logistica" element={<Navigate to="/logistica/consulta" replace />} />
        <Route path="/logistica/registro" element={<P modulo="logistica"><RegistroCarga /></P>} />
        <Route path="/logistica/consulta" element={<P modulo="logistica"><ConsultaCarga /></P>} />
        <Route path="/logistica/actualizar/:id" element={<P modulo="logistica"><ActualizarCarga /></P>} />
        <Route path="/logistica/panel" element={<P modulo="logistica" roles={['administrador', 'empleado']}><PanelLogistica /></P>} />

        {/* Rutas protegidas de Migraciones Peru */}
        <Route path="/migraciones/registro" element={<P modulo="migraciones"><RegistroCita /></P>} />
        <Route path="/migraciones/consulta" element={<P modulo="migraciones"><ConsultaCita /></P>} />
        <Route path="/migraciones/actualizar/:id" element={<P modulo="migraciones"><ActualizarCita /></P>} />
        <Route path="/migraciones/panel" element={<P modulo="migraciones" roles={['administrador', 'empleado']}><PanelAdmin /></P>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
