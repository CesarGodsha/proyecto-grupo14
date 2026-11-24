# Proyecto Grupo 14 · Comercio Exterior Junín

React (frontend) + Node/Express (backend) + 1 sola base de datos Neon.
Módulos: LogísticaMax (Wilder), GORE Junín (Fernando), Migraciones (César).

## Primera vez (cada integrante)

1. Backend: en `backend/` ejecuta `npm install`, copia `.env.example` a `.env` y completa
   `DATABASE_URL` (cadena de Neon que pasa el grupo) y `JWT_SECRET`.
2. Solo UNA persona del grupo ejecuta `npm run db:init` (crea tablas y usuarios de prueba).
3. Backend: `npm run dev` (http://localhost:3000/api/salud).
4. Frontend: en `frontend/` ejecuta `npm install` y luego `npm run dev` (http://localhost:5173).

## Usuarios de prueba (contraseña 123456)

admin@logisticamax.pe · empleado1@logisticamax.pe · conductor1@logisticamax.pe
admin@gore.pe · empleado@gore.pe · admin@migraciones.pe · empleado@migraciones.pe

## Reglas del grupo

- Una rama de Git por persona; cada uno toca solo su módulo:
  `backend/src/routes/<modulo>.routes.js` y `frontend/src/modulos/<modulo>/`.
- Archivos compartidos (`server.js`, `App.jsx`, `schema.sql`): avisar antes de cambiarlos.
- `git pull` antes de empezar. Nunca subir `.env`.
- Nombres fijos: módulos `logistica`, `gore`, `migraciones`; roles `cliente`, `administrador`, `empleado`.
