import { w } from '../middleware/auth.js';
import * as logisticaService from '../services/logistica.service.js';

export const crear = w(async (req, res) => {
  res.status(201).json(
    await logisticaService.crear(req.usuario, req.body || {})
  );
});

export const listarMias = w(async (req, res) => {
  res.json(await logisticaService.listarMias(req.usuario.id));
});

export const listarPermisosGore = w(async (req, res) => {
  res.json(await logisticaService.listarPermisosGore(req.usuario));
});

export const actualizar = w(async (req, res) => {
  res.json(
    await logisticaService.actualizar(
      req.params.id,
      req.usuario,
      req.body || {}
    )
  );
});

export const listarTodas = w(async (req, res) => {
  res.json(await logisticaService.listarTodas());
});

export const cambiarEstado = w(async (req, res) => {
  res.json(
    await logisticaService.cambiarEstado(
      req.params.id,
      req.body?.estado
    )
  );
});

export const eliminar = w(async (req, res) => {
  res.json(await logisticaService.eliminar(req.params.id));
});
