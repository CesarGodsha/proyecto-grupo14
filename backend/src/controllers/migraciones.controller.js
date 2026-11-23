import * as MigService from '../services/migraciones.service.js';
export async function crear(req, res) { res.status(201).json(await MigService.crear(req.usuario.id, req.body)); }
export async function mias(req, res) { res.json(await MigService.mias(req.usuario.id)); }
export async function actualizar(req, res) { res.json(await MigService.actualizar(req.params.id, req.usuario.id, req.body)); }
export async function todas(req, res) { res.json(await MigService.todas()); }
export async function cambiarEstado(req, res) { res.json(await MigService.cambiarEstado(req.params.id, req.body.estado)); }
export async function eliminar(req, res) { res.json(await MigService.eliminar(req.params.id)); }
