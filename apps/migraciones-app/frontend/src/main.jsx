import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import ModuleAuthBridge from './components/ModuleAuthBridge.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import ModuleNavigation from './components/ModuleNavigation.jsx';
import InicioMigraciones from './modulos/migraciones/InicioMigraciones.jsx';
import RegistroCita from './modulos/migraciones/RegistroCita.jsx';
import ConsultaCita from './modulos/migraciones/ConsultaCita.jsx';
import ActualizarCita from './modulos/migraciones/ActualizarCita.jsx';
import PanelAdmin from './modulos/migraciones/PanelAdmin.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import './styles/design-system.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModuleAuthBridge>
      <HashRouter>
        <ModuleNavigation />
        <Routes>
          <Route path="/migraciones" element={<InicioMigraciones />} />
          <Route
            path="/migraciones/registro"
            element={
              <RutaProtegida modulo="migraciones" roles={['cliente']}>
                <RegistroCita />
              </RutaProtegida>
            }
          />
          <Route
            path="/migraciones/consulta"
            element={
              <RutaProtegida modulo="migraciones" roles={['cliente']}>
                <ConsultaCita />
              </RutaProtegida>
            }
          />
          <Route
            path="/migraciones/actualizar/:id"
            element={
              <RutaProtegida modulo="migraciones" roles={['cliente']}>
                <ActualizarCita />
              </RutaProtegida>
            }
          />
          <Route
            path="/migraciones/panel"
            element={
              <RutaProtegida modulo="migraciones" roles={['administrador', 'empleado']}>
                <PanelAdmin />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/migraciones" replace />} />
        </Routes>
      </HashRouter>
    </ModuleAuthBridge>
  </StrictMode>
);
