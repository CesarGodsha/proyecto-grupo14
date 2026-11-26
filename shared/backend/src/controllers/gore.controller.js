import { w } from '../middleware/auth.js';
import * as goreService from '../services/gore.service.js';

export const listar = w(async (req, res) => {
  res.json(
    await goreService.listar({
      usuario: req.usuario,
      estado: req.query.estado,
      q: req.query.q,
    })
  );
});

export const crear = w(async (req, res) => {
  const tramite = await goreService.crear({
    usuario: req.usuario,
    ...req.body,
  });
  res.status(201).json(tramite);
});

export const actualizar = w(async (req, res) => {
  res.json(await goreService.actualizar(req.params.id, req.body || {}));
});

export const eliminar = w(async (req, res) => {
  await goreService.eliminar(req.params.id);
  res.json({ mensaje: 'Expediente eliminado correctamente' });
});
