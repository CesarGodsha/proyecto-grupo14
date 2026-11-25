import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MenuMigraciones from './components/MenuMigraciones.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import RegistroCita from './modulos/migraciones/RegistroCita.jsx';
import ConsultaCita from './modulos/migraciones/ConsultaCita.jsx';
import ActualizarCita from './modulos/migraciones/ActualizarCita.jsx';
import PanelAdmin from './modulos/migraciones/PanelAdmin.jsx';
function Marco(){ return (<RutaProtegida><MenuMigraciones/><main><Outlet/></main></RutaProtegida>); }
const P=({modulo,roles,children})=>(<RutaProtegida modulo={modulo} roles={roles}>{children}</RutaProtegida>);
export default function App(){ return (<Routes><Route path="/login" element={<Login/>}/><Route element={<Marco/>}><Route path="/" element={<Navigate to="/migraciones/consulta" replace/>}/><Route path="/migraciones/registro" element={<P modulo="migraciones"><RegistroCita/></P>}/><Route path="/migraciones/consulta" element={<P modulo="migraciones"><ConsultaCita/></P>}/><Route path="/migraciones/actualizar/:id" element={<P modulo="migraciones"><ActualizarCita/></P>}/><Route path="/migraciones/panel" element={<P modulo="migraciones" roles={['administrador','empleado']}><PanelAdmin/></P>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>); }
