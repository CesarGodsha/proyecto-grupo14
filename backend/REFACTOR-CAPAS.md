# Refactor por capas - rama refactor/capas

Sin cambios de logica, solo orden.

## Nueva estructura backend/src
- app.js -> configura express
- server.js -> solo arranca
- routes/ -> solo URLs + middlewares, llaman a controllers
- controllers/ -> req/res -> services
- services/ -> reglas negocio (calcularTarifa, validaciones, bcrypt/jwt)
- models/ -> solo SQL (pool.query)
- middleware/auth.js -> igual que antes
- db.js -> igual

## Probar
```bash
cd backend
npm install
npm run dev
# probar: GET http://localhost:3000/api/salud
# POST http://localhost:3000/api/auth/login
```

Si todo OK, hacer merge a main desde GitHub Pull Request.
