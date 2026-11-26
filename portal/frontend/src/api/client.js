import axios from 'axios';

export function normalizarBaseApi(valor) {
  const configurada = String(valor || '').trim().replace(/\/+$/, '');
  if (!configurada) return '/api';
  return configurada.endsWith('/api') ? configurada : `${configurada}/api`;
}

export const api = axios.create({
  baseURL: normalizarBaseApi(import.meta.env.VITE_API_URL),
});

let tokenDeSesion = null;

export function setApiToken(token) {
  tokenDeSesion = token || null;
}

// Envía el token en cada petición
api.interceptors.request.use((cfg) => {
  const token = tokenDeSesion || localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const mensajeDeError = (e) =>
  e.response?.data?.mensaje ||
  e.response?.data?.error ||
  (e.response
    ? `La solicitud falló (HTTP ${e.response.status})`
    : 'No se pudo conectar con el servidor');
