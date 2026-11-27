import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import ModuleAuthBridge from './components/ModuleAuthBridge.jsx';
import ModuleNavigation from './components/ModuleNavigation.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import ConsultaCarga from './modulos/logistica/ConsultaCarga.jsx';
import RegistroCarga from './modulos/logistica/RegistroCarga.jsx';
import ActualizarCarga from './modulos/logistica/ActualizarCarga.jsx';
import PanelLogistica from './modulos/logistica/PanelLogistica.jsx';
import ControlTurnos from './modulos/logistica/ControlTurnos.jsx';
import Inicio from './modulos/logistica/Inicio.jsx';
import FondoRutasGpsLogistica from './modulos/logistica/FondoRutasGpsLogistica.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import './styles/design-system.css';
import './styles/visual-theme.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModuleAuthBridge>
      <HashRouter>
        <FondoRutasGpsLogistica />
        <ModuleNavigation />
        <Routes>
          <Route path="/logistica" element={<Inicio />} />
          <Route
            path="/logistica/registro"
            element={
              <RutaProtegida modulo="logistica" roles={['cliente']}>
                <RegistroCarga />
              </RutaProtegida>
            }
          />
          <Route
            path="/logistica/consulta"
            element={
              <RutaProtegida modulo="logistica" roles={['cliente', 'administrador', 'empleado']}>
                <ConsultaCarga />
              </RutaProtegida>
            }
          />
          <Route
            path="/logistica/actualizar/:id"
            element={
              <RutaProtegida modulo="logistica" roles={['cliente']}>
                <ActualizarCarga />
              </RutaProtegida>
            }
          />
          <Route
            path="/logistica/panel"
            element={
              <RutaProtegida modulo="logistica" roles={['administrador', 'empleado']}>
                <PanelLogistica />
              </RutaProtegida>
            }
          />
          <Route
            path="/logistica/turnos"
            element={
              <RutaProtegida modulo="logistica" roles={['administrador']}>
                <ControlTurnos />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/logistica" replace />} />
        </Routes>
      </HashRouter>
    </ModuleAuthBridge>
  </StrictMode>
);
