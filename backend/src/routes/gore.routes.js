import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// 1. Listar todos los trámites, filtrar por estado (?estado=atendido) o buscar (?q=30 o ?q=EXP-00030)
router.get('/', async (req, res) => {
  try {
    const { estado, q } = req.query;

    let sql = `
      SELECT 
        t.id,
        'EXP-' || LPAD(t.id::text, 5, '0') AS codigo,
        t.id_usuario,
        COALESCE(u.nombre, 'Administrado #' || t.id_usuario) AS administrado,
        t.asunto,
        t.documento,
        t.estado,
        t.creado_en
      FROM tramites_mesa_partes t
      LEFT JOIN usuarios u ON u.id = t.id_usuario
    `;
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      sql += `
        WHERE t.id::text ILIKE $1
           OR ('EXP-' || LPAD(t.id::text, 5, '0')) ILIKE $1
           OR COALESCE(u.nombre, '') ILIKE $1
           OR t.asunto ILIKE $1
      `;
    } else if (estado) {
      params.push(estado);
      sql += ` WHERE t.estado = $1`;
    }

    sql += ` ORDER BY t.id DESC`;

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar trámites del GORE: ' + error.message });
  }
});

// 2. Registrar un nuevo expediente en Mesa de Partes
router.post('/', async (req, res) => {
  try {
    const { id_usuario, asunto, documento } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO tramites_mesa_partes (id_usuario, asunto, documento, estado)
       VALUES ($1, $2, $3, 'registrado')
       RETURNING id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, id_usuario, asunto, documento, estado, creado_en`,
      [id_usuario || 1, asunto, documento || 'solicitud.pdf']
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar expediente: ' + error.message });
  }
});

// 3. Actualizar asunto/documento o cambiar estado (Aprobar / Observar) desde el Panel GORE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, asunto, documento } = req.body;

    const { rows } = await pool.query(
      `UPDATE tramites_mesa_partes
       SET estado = COALESCE($1, estado),
           asunto = COALESCE($2, asunto),
           documento = COALESCE($3, documento)
       WHERE id = $4
       RETURNING id, 'EXP-' || LPAD(id::text, 5, '0') AS codigo, id_usuario, asunto, documento, estado, creado_en`,
      [estado || null, asunto || null, documento || null, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar expediente: ' + error.message });
  }
});

// 4. Eliminar trámite
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM tramites_mesa_partes WHERE id = $1`, [id]);
    res.json({ mensaje: 'Expediente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar expediente: ' + error.message });
  }
});

export default router;