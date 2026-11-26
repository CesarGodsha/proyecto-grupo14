# Proyecto Grupo 14 · Comercio Exterior Junín

Portal de acceso único para los módulos GORE, Logística y Migraciones. Cada aplicación tiene su propio frontend, backend y colección Postman; comparten autenticación, base de datos y utilidades del servidor.

## Estructura

```text
portal/
  frontend/              # login y portal que abre los módulos
  backend/               # punto de entrada de autenticación
  postman/               # colección de autenticación
apps/
  gore-app/
    frontend/
    backend/
    postman/
  logistica-app/
    frontend/
    backend/
    postman/
  migraciones-app/
    frontend/
    backend/
    postman/
shared/
  backend/                # DB, esquema, autenticación, rutas y lógica reutilizada
postman/                  # colección agregada para compatibilidad
```

## Desarrollo local

Requiere Node.js y una base de datos PostgreSQL accesible.

1. Copia `.env.example` a `.env` en la raíz y configura `DATABASE_URL` y un `JWT_SECRET` largo y aleatorio. Los cuatro servicios usan los mismos valores.
2. Instala las dependencias backend compartidas y de cada servicio:
   `npm ci --prefix shared/backend`,
   `npm ci --prefix portal/backend`,
   `npm ci --prefix apps/gore-app/backend`,
   `npm ci --prefix apps/logistica-app/backend` y
   `npm ci --prefix apps/migraciones-app/backend`.
3. Instala cada frontend: `npm ci --prefix portal/frontend`, `npm ci --prefix apps/gore-app/frontend`, `npm ci --prefix apps/logistica-app/frontend` y `npm ci --prefix apps/migraciones-app/frontend`.
4. Inicializa esquema y datos de demostración: `node shared/backend/database/init.js`. Crea usuarios con contraseña `123456`; úsalo solo en una base de datos de desarrollo.
5. Inicia los servicios en terminales separadas:

   ```text
   npm --prefix portal/backend run dev                 # auth API :3000
   npm --prefix apps/gore-app/backend run dev          # GORE API :3001
   npm --prefix apps/logistica-app/backend run dev     # Logística API :3002
   npm --prefix apps/migraciones-app/backend run dev   # Migraciones API :3003
   ```

6. Inicia los frontends, también en terminales separadas:

   ```text
   npm --prefix portal/frontend run dev                # portal :5173
   npm --prefix apps/gore-app/frontend run dev         # GORE :5174
   npm --prefix apps/logistica-app/frontend run dev    # Logística :5175
   npm --prefix apps/migraciones-app/frontend run dev  # Migraciones :5176
   ```

El portal autentica una sola vez y entrega la sesión al módulo mediante `postMessage`, validando el origen y la ventana del iframe. El token no se incluye en la URL. En desarrollo, Vite reenvía `/api` al backend de cada módulo.

## Autenticación y permisos

Los servicios comparten el esquema de [shared/backend/database/schema.sql](./shared/backend/database/schema.sql), `DATABASE_URL` y `JWT_SECRET`. El middleware comprueba el token y el rol del módulo; las consultas de GORE y Logística limitan los registros de clientes a los suyos. Los permisos de empleado o administrador deben asignarse explícitamente en `usuario_rol`.

El usuario de prueba `cliente1@correo.pe` tiene la contraseña `123456` después de inicializar la base de datos. No uses cuentas de demostración en producción.

Para asignar un rol autorizado, sustituye `CORREO_DE_LA_CUENTA` y el módulo correspondiente:

```sql
UPDATE usuario_rol
SET rol = 'administrador'
WHERE id_usuario = (
  SELECT id FROM usuarios WHERE email = 'CORREO_DE_LA_CUENTA'
)
AND modulo = 'gore';
```

## Postman

Cada aplicación incluye su propia colección y entorno:

- Portal/auth: `portal/postman/`
- GORE: `apps/gore-app/postman/`
- Logística: `apps/logistica-app/postman/`
- Migraciones: `apps/migraciones-app/postman/`

Importa ambos JSON de la app que quieras probar y selecciona su entorno. Ejecuta primero el login para guardar el token; configura credenciales de empleado/administrador para las carpetas opcionales. La colección agregada de `postman/` sigue disponible para el backend integrado de compatibilidad.

## Pruebas y compatibilidad

Ejecuta `npm --prefix shared/backend test` para las pruebas backend. Los cuatro frontends tienen su propio `npm run build`.

El backend agregado anterior sigue disponible con `node shared/backend/src/server.js` en el puerto 3000. No lo inicies al mismo tiempo que el servicio de autenticación independiente, porque comparten ese puerto.

## Publicación

- **Render:** [render.yaml](./render.yaml) define cuatro servicios backend. Configura `DATABASE_URL`, `JWT_SECRET` y `CORS_ORIGIN` con los cuatro orígenes HTTPS autorizados.
- **Vercel:** crea un proyecto para cada carpeta `*/frontend`; usa `npm run build` y `dist` como directorio de salida.
- En producción, configura `VITE_AUTH_API_URL` en el portal; en cada módulo configura `VITE_API_URL`, `VITE_PORTAL_ORIGIN` y `VITE_PORTAL_URL`. Las URLs de frontend del portal se configuran con `VITE_GORE_FRONTEND_URL`, `VITE_LOGISTICA_FRONTEND_URL` y `VITE_MIGRACIONES_FRONTEND_URL`.
- No subas `.env`, contraseñas, tokens ni valores secretos. Los archivos `.env.example` documentan las variables necesarias.

Los despliegues no se ejecutan automáticamente desde este repositorio.
