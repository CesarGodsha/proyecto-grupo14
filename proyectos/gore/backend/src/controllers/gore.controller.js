import * as goreRepo from '../repositories/gore.repository.js';

export const listar = async (req, res) => {
  try {
    const { estado, q } = req.query;
    const tramites = await goreRepo.listarTramites(estado, q);
    res.json(tramites);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar trámites del GORE: ' + error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const { id_usuario, asunto, documento } = req.body;
    const nuevoTramite = await goreRepo.crearTramite(id_usuario, asunto, documento);
    res.status(201).json(nuevoTramite);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar expediente: ' + error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, asunto, documento } = req.body;
    const actualizado = await goreRepo.actualizarTramite(id, estado, asunto, documento);

    if (!actualizado) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar expediente: ' + error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await goreRepo.eliminarTramite(id);
    res.json({ mensaje: 'Expediente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar expediente: ' + error.message });
  }
};