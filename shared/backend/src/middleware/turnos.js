import { obtenerTurnoEmpleado } from '../repositories/turnos.repository.js';

const ZONA_HORARIA = 'America/Lima';

function horaLocalEnMinutos(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA_HORARIA,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);
  const hora = Number(partes.find((parte) => parte.type === 'hour')?.value);
  const minuto = Number(partes.find((parte) => parte.type === 'minute')?.value);
  return hora * 60 + minuto;
}

function parsearHora(valor) {
  const coincidencia = /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d(?:\.\d+)?)?$/.exec(
    String(valor)
  );
  if (!coincidencia) throw new Error('El horario guardado no es válido');
  return Number(coincidencia[1]) * 60 + Number(coincidencia[2]);
}

export function estaDentroDeTurno(horaInicio, horaFin, minutoActual) {
  const inicio = parsearHora(horaInicio);
  const fin = parsearHora(horaFin);
  if (inicio === fin) throw new Error('El horario guardado no es válido');
  return inicio < fin
    ? minutoActual >= inicio && minutoActual < fin
    : minutoActual >= inicio || minutoActual < fin;
}

export function crearControlTurno({
  obtenerTurno = obtenerTurnoEmpleado,
  obtenerMinutoActual = horaLocalEnMinutos,
} = {}) {
  return (modulo) => async (req, res, next) => {
    const esEmpleado = req.usuario?.roles?.some(
      (rol) => rol.modulo === modulo && rol.rol === 'empleado'
    );
    if (!esEmpleado) return next();

    try {
      const turno = await obtenerTurno(req.usuario.id, modulo);
      if (!turno) return next();
      if (
        estaDentroDeTurno(
          turno.hora_inicio,
          turno.hora_fin,
          obtenerMinutoActual()
        )
      ) {
        return next();
      }
      return res.status(403).json({
        mensaje: `Tu turno está fuera del horario permitido (${String(turno.hora_inicio).slice(0, 5)} a ${String(turno.hora_fin).slice(0, 5)}).`,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export const controlarTurno = crearControlTurno();
