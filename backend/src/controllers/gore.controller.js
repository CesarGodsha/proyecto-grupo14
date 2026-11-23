import * as GoreService from '../services/gore.service.js';
export async function list(req, res) { res.json(await GoreService.listar(req.query)); }
export async function create(req, res) { res.status(201).json(await GoreService.crear(req.body)); }
export async function update(req, res) { res.json(await GoreService.actualizar(req.params.id, req.body)); }
export async function remove(req, res) { res.json(await GoreService.eliminar(req.params.id)); }
