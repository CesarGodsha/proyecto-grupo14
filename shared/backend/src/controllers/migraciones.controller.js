import { w } from '../middleware/auth.js';
import * as migracionesService from '../services/migraciones.service.js';

export const crear = w(async (req, res) => {
  res.status(201).json(
    await migracionesService.crear(req.usuario, req.body || {})
  );
});

export const listarMias = w(async (req, res) => {
  res.json(await migracionesService.listarMias(req.usuario.id));
});

export const actualizar = w(async (req, res) => {
  res.json(
    await migracionesService.actualizar(
      req.params.id,
      req.usuario.id,
      req.body || {}
    )
  );
});

export const listarTodas = w(async (req, res) => {
  res.json(await migracionesService.listarTodas());
});

export const cambiarEstado = w(async (req, res) => {
  res.json(
    await migracionesService.cambiarEstado(req.params.id, req.body?.estado)
  );
});

export const eliminar = w(async (req, res) => {
  res.json(await migracionesService.eliminar(req.params.id));
});
