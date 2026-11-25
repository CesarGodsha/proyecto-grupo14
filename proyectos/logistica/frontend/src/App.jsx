import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
// App logistica S12: App.jsx con rutas propias
function Marco(){ return (<RutaProtegida><main><Outlet/></main></RutaProtegida>); }
export default function App(){ return (<Routes><Route path="/login" element={<Login/>}/><Route element={<Marco/>}><Route path="/" element={<div>logistica - ver modulos/logistica/Inicio.jsx</div>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>); }
