import axios from 'axios';
import { normalizarBaseApi } from './client.js';

const authApi = axios.create({
  baseURL: normalizarBaseApi(import.meta.env.VITE_AUTH_API_URL),
});

export async function iniciarSesion(email, password) {
  const { data } = await authApi.post('/auth/login', { email, password });
  return data;
}

export async function registrarCliente(datos) {
  const { data } = await authApi.post('/auth/register', datos);
  return data;
}
