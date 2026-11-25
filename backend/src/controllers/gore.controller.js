import * as goreRepo from '../repositories/gore.repository.js';
import { w } from '../middleware/auth.js';

export const listar = w(async (req, res) => {
  const { estado, q } = req.query;
  const tramites = await goreRepo.listarTramites(estado, q);
  res.json(tramites);
});

export const crear = w(async (req, res) => {
  const { asunto, documento } = req.body;
  const idUsuario = req.usuario.id;
  const nuevoTramite = await goreRepo.crearTramite(idUsuario, asunto, documento);
  res.status(201).json(nuevoTramite);
});

export const actualizar = w(async (req, res) => {
  const { id } = req.params;
  const { estado, asunto, documento } = req.body;
  const actualizado = await goreRepo.actualizarTramite(id, estado, asunto, documento);
  if (!actualizado) {
    return res.status(404).json({ error: 'Expediente no encontrado' });
  }
  res.json(actualizado);
});

export const eliminar = w(async (req, res) => {
  const { id } = req.params;
  await goreRepo.eliminarTramite(id);
  res.json({ mensaje: 'Expediente eliminado correctamente' });
});
