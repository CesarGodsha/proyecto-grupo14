import * as turnosRepo from '../repositories/turnos.repository.js';
import AppError from '../utils/AppError.js';
import { w } from '../middleware/auth.js';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HORA_VALIDA = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function validarEmail(valor) {
  const email = String(valor || '').trim().toLowerCase();
  if (!EMAIL_VALIDO.test(email)) {
    throw new AppError(400, 'Ingresa un correo válido');
  }
  return email;
}

export const listar = (modulo) =>
  w(async (req, res) => {
    res.json(await turnosRepo.listarTurnos(modulo));
  });

export const guardar = (modulo) =>
  w(async (req, res) => {
    const email = validarEmail(req.body?.email);
    const horaInicio = String(req.body?.hora_inicio || '');
    const horaFin = String(req.body?.hora_fin || '');
    if (!HORA_VALIDA.test(horaInicio) || !HORA_VALIDA.test(horaFin)) {
      throw new AppError(400, 'Ingresa una hora de inicio y fin válidas');
    }
    if (horaInicio === horaFin) {
      throw new AppError(400, 'La hora de inicio y fin no pueden ser iguales');
    }
    if (!(await turnosRepo.guardarTurno(modulo, email, horaInicio, horaFin))) {
      throw new AppError(404, 'No se encontró un empleado con ese correo en este módulo');
    }
    res.json({ mensaje: 'Turno guardado' });
  });

export const eliminar = (modulo) =>
  w(async (req, res) => {
    const email = validarEmail(req.body?.email);
    if (!(await turnosRepo.eliminarTurno(modulo, email))) {
      throw new AppError(404, 'No se encontró un turno para ese empleado');
    }
    res.json({ mensaje: 'Turno eliminado' });
  });
