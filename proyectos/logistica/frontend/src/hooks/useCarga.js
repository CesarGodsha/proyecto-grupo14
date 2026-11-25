import { useState } from 'react';
import { api } from '../api/client.js';
export function useCarga(){ const [datos,setDatos]=useState([]); async function cargar(){ const {data}=await api.get('/logistica'); setDatos(data);} return {datos,cargar}; }
