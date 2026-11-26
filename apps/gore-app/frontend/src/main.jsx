import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import ModuleAuthBridge from './components/ModuleAuthBridge.jsx';
import GoreLayout from './components/GoreLayout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import FondoRedNeuronalAzul from './modulos/gore/FondoRedNeuronalAzul.jsx';
import InicioGore from './modulos/gore/InicioGore.jsx';
import {
  ConsultaGorePage,
  PanelGorePage,
  RegistroGorePage,
} from './modulos/gore/PaginasGore.jsx';
import './styles/index.css';
import './styles/design-system.css';
import './modulos/gore/gore.css';
import './styles/visual-theme.css';

function RutaPersonalGore({ children }) {
  const { rolDe } = useAuth();
  const esPersonal = ['administrador', 'empleado'].includes(rolDe('gore'));
  return esPersonal ? children : <Navigate to="/gore" replace />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModuleAuthBridge>
      <HashRouter>
        <FondoRedNeuronalAzul />
        <Routes>
          <Route path="/gore" element={<GoreLayout />}>
            <Route index element={<InicioGore />} />
            <Route path="registro" element={<RegistroGorePage />} />
            <Route path="consulta" element={<ConsultaGorePage />} />
            <Route
              path="panel"
              element={
                <RutaPersonalGore>
                  <PanelGorePage />
                </RutaPersonalGore>
              }
            />
            <Route path="*" element={<Navigate to="/gore" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/gore" replace />} />
        </Routes>
      </HashRouter>
    </ModuleAuthBridge>
  </StrictMode>
);
