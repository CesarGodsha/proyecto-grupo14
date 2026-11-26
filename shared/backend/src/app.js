import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import goreRoutes from './routes/gore.routes.js';
import logisticaRoutes from './routes/logistica.routes.js';
import migracionesRoutes from './routes/migraciones.routes.js';
import integracionesRoutes from './routes/integraciones.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/salud', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/gore', goreRoutes);
app.use('/api/logistica', logisticaRoutes);
app.use('/api/migraciones', migracionesRoutes);
app.use('/api/integraciones', integracionesRoutes);

app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use(errorHandler);

export default app;
