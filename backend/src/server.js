import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import goreRoutes from './routes/gore.routes.js';
import logisticaRoutes from './routes/logistica.routes.js';
import migracionesRoutes from './routes/migraciones.routes.js';
import integracionesRoutes from './routes/integraciones.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/salud', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/gore', goreRoutes);
app.use('/api/logistica', logisticaRoutes);
app.use('/api/migraciones', migracionesRoutes);
app.use('/api/integraciones', integracionesRoutes);

app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}/api`));
