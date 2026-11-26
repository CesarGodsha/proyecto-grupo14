import { pool } from '../db.js';

export async function obtenerEstadoModulo() {
  const { rows } = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM usuarios) AS usuarios,
      (SELECT COUNT(*)::int FROM tramites_mesa_partes) AS tramites_gore,
      (SELECT COUNT(*)::int FROM cotizaciones_carga) AS cotizaciones_logistica,
      (SELECT COUNT(*)::int FROM citas_migraciones) AS citas_migraciones
  `);
  return { estado: 'conectado', modulos: rows[0] };
}
