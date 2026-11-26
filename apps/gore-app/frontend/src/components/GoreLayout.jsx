import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import IconoGore from './IconoGore.jsx';
import ModuleNavigation from './ModuleNavigation.jsx';

export default function GoreLayout() {
  const { usuario, rolDe } = useAuth();
  const rolGore = rolDe('gore') || 'cliente';

  return (
    <>
      <ModuleNavigation />
      <div className="gore-wrapper">
        <div className="gore-content">
          <nav className="gore-site-bar" aria-label="Enlaces institucionales">
            <span>
              <strong>JUNÍN</strong>
              Atención digital · Proyecto Grupo 14
            </span>
            <a
              href="https://www.regionjunin.gob.pe/"
              target="_blank"
              rel="noreferrer"
            >
              Portal institucional oficial <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <header className="gore-header">
            <div className="gore-brand">
              <span className="gore-monogram" aria-hidden="true">GJ</span>
              <div>
                <span className="gore-kicker">GOBIERNO REGIONAL DE JUNÍN</span>
                <h1>Mesa de Partes Virtual</h1>
                <p className="gore-subtitle">
                  Bienvenido, <strong>{usuario?.nombre || 'usuario'}</strong>.
                  Gestiona tus expedientes regionales.
                </p>
              </div>
            </div>
            <div className="gore-account-card">
              <span className="gore-account-icon" aria-hidden="true">
                <IconoGore nombre="persona" />
              </span>
              <div>
                <strong>Acceso GORE</strong>
                <span className="gore-rol-pill">{rolGore}</span>
              </div>
            </div>
          </header>

          <Outlet />

          <footer className="gore-disclaimer">
            Este módulo forma parte del proyecto Grupo 14 y no reemplaza los
            canales ni sistemas oficiales del Gobierno Regional de Junín.
          </footer>
        </div>
      </div>
    </>
  );
}
