import { api, mensajeDeError } from '../../api/client.js';
import ControlTurnosPanel from '../../../../../../shared/frontend/ControlTurnosPanel.jsx';

export default function ControlTurnos() {
  return (
    <ControlTurnosPanel
      api={api}
      mensajeDeError={mensajeDeError}
      ruta="/gore/turnos"
      modulo="GORE"
    />
  );
}
