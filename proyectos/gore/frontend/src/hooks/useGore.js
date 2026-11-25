import { useState } from 'react';
import { api } from '../api/client.js';
export function useGore(){ const [datos,setDatos]=useState([]); async function cargar(){ const {data}=await api.get('/gore'); setDatos(data);} return {datos,cargar}; }
