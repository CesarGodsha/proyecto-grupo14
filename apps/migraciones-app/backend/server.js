import migracionesApp from './app.js';
import startServer from '../../../shared/backend/src/startServer.js';

startServer(migracionesApp, 'Migraciones', 3003);
