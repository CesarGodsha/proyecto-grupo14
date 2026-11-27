import { pool } from '../db.js';
import AppError from '../utils/AppError.js';

async function consultarTurnos(sql, parametros) {
  try {
    return await pool.query(sql, parametros);
  } catch (error) {
    if (error.code === '42P01') {
      throw new AppError(
        503,
        'No se encontró la tabla turnos_empleado en la base configurada. Ejecuta el SQL de Control turnos en la misma base y esquema public que utiliza esta API.'
      );
    }
    throw error;
  }
}

export async function listarTurnos(modulo) {
  const { rows } = await consultarTurnos(
    `SELECT u.nombre, u.email,
            to_char(t.hora_inicio, 'HH24:MI') AS hora_inicio,
            to_char(t.hora_fin, 'HH24:MI') AS hora_fin
     FROM usuario_rol ur
     JOIN usuarios u ON u.id = ur.id_usuario
     LEFT JOIN turnos_empleado t
       ON t.id_usuario = ur.id_usuario AND t.modulo = ur.modulo
     WHERE ur.modulo = $1 AND ur.rol = 'empleado'
     ORDER BY lower(u.nombre), lower(u.email)`,
    [modulo]
  );
  return rows;
}

export async function guardarTurno(modulo, email, horaInicio, horaFin) {
  const { rows } = await consultarTurnos(
    `INSERT INTO turnos_empleado (id_usuario, modulo, hora_inicio, hora_fin)
     SELECT ur.id_usuario, $2, $3::time, $4::time
     FROM usuario_rol ur
     JOIN usuarios u ON u.id = ur.id_usuario
     WHERE ur.modulo = $2 AND ur.rol = 'empleado'
       AND lower(u.email) = lower($1)
     ON CONFLICT (id_usuario, modulo)
     DO UPDATE SET hora_inicio = EXCLUDED.hora_inicio,
                   hora_fin = EXCLUDED.hora_fin,
                   actualizado_en = NOW()
     RETURNING id_usuario`,
    [email, modulo, horaInicio, horaFin]
  );
  return rows.length > 0;
}

export async function eliminarTurno(modulo, email) {
  const { rows } = await consultarTurnos(
    `DELETE FROM turnos_empleado t
     USING usuarios u, usuario_rol ur
     WHERE t.id_usuario = u.id AND t.id_usuario = ur.id_usuario
       AND t.modulo = ur.modulo AND ur.modulo = $2
       AND ur.rol = 'empleado' AND lower(u.email) = lower($1)
     RETURNING t.id_usuario`,
    [email, modulo]
  );
  return rows.length > 0;
}

export async function obtenerTurnoEmpleado(idUsuario, modulo) {
  const { rows } = await consultarTurnos(
    `SELECT hora_inicio, hora_fin
     FROM turnos_empleado
     WHERE id_usuario = $1 AND modulo = $2`,
    [idUsuario, modulo]
  );
  return rows[0] || null;
}
