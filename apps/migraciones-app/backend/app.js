import express from 'express';
import cors from 'cors';
import migracionesRoutes from '../../../shared/backend/src/routes/migraciones.routes.js';
import errorHandler from '../../../shared/backend/src/middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/api/salud', (req, res) =>
  res.json({ ok: true, servicio: 'migraciones' })
);
app.use('/api/migraciones', migracionesRoutes);
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use(errorHandler);

export default app;
