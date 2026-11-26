import { useNavigate } from 'react-router-dom';
import ConsultaGore from './ConsultaGore.jsx';
import PanelGore from './PanelGore.jsx';
import RegistroGore from './RegistroGore.jsx';

function EncabezadoPagina({ etiqueta, titulo, descripcion }) {
  return (
    <header className="gore-page-heading">
      <span>{etiqueta}</span>
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </header>
  );
}

export function RegistroGorePage() {
  const navigate = useNavigate();

  return (
    <main className="gore-page-shell">
      <EncabezadoPagina
        etiqueta="MESA DE PARTES · NUEVA SOLICITUD"
        titulo="Registrar expediente"
        descripcion="Completa los datos del trámite para generar un nuevo expediente."
      />
      <RegistroGore alRegistrar={() => navigate('/gore/consulta')} />
    </main>
  );
}

export function ConsultaGorePage() {
  return (
    <main className="gore-page-shell">
      <EncabezadoPagina
        etiqueta="MESA DE PARTES · SEGUIMIENTO"
        titulo="Consulta de expedientes"
        descripcion="Busca solicitudes y revisa su estado de atención."
      />
      <ConsultaGore />
    </main>
  );
}

export function PanelGorePage() {
  return (
    <main className="gore-page-shell">
      <EncabezadoPagina
        etiqueta="GESTIÓN INTERNA · PERSONAL AUTORIZADO"
        titulo="Bandeja de atención"
        descripcion="Revisa los expedientes recibidos y registra su avance."
      />
      <PanelGore />
    </main>
  );
}
