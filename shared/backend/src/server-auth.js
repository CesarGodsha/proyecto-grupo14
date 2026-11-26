import authApp from './apps/auth.app.js';
import startServer from './startServer.js';

startServer(authApp, 'Auth', 3000);
