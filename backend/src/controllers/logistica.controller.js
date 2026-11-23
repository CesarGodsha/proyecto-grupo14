import * as LogService from '../services/logistica.service.js';
export async function crear(req, res) {
  const result = await LogService.crearCotizacion({ id_usuario: req.usuario.id, nombreUsuario: req.usuario.nombre, ...req.body });
  res.status(201).json(result);
}
export async function mias(req, res) { res.json(await LogService.misCotizaciones(req.usuario.id)); }
export async function permisos(req, res) { res.json(await LogService.permisosPara(req.usuario)); }
export async function actualizar(req, res) { res.json(await LogService.actualizarCotizacion(req.params.id, req.body)); }
export async function todas(req, res) { res.json(await LogService.todas()); }
export async function cambiarEstado(req, res) { res.json(await LogService.cambiarEstado(req.params.id, req.body.estado)); }
export async function eliminar(req, res) { res.json(await LogService.eliminar(req.params.id)); }
