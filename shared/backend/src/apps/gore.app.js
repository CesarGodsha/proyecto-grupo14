import express from 'express';
import cors from 'cors';
import goreRoutes from '../routes/gore.routes.js';
import errorHandler from '../middleware/errorHandler.js';
import corsOptions from '../middleware/corsOptions.js';

const app = express();

app.use(cors(corsOptions()));
app.use(express.json({ limit: '1mb' }));
app.get('/api/salud', (req, res) =>
  res.json({ ok: true, servicio: 'gore' })
);
app.use('/api/gore', goreRoutes);
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use(errorHandler);

export default app;
