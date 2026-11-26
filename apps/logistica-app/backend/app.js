import express from 'express';
import cors from 'cors';
import logisticaRoutes from '../../../shared/backend/src/routes/logistica.routes.js';
import errorHandler from '../../../shared/backend/src/middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/api/salud', (req, res) =>
  res.json({ ok: true, servicio: 'logistica' })
);
app.use('/api/logistica', logisticaRoutes);
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use(errorHandler);

export default app;
