import authApp from './app.js';
import startServer from '../../shared/backend/src/startServer.js';

startServer(authApp, 'Auth', 3000);
