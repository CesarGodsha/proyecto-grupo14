import { useState } from 'react';
import { api, mensajeDeError } from '../api/client.js';
// Hook S12: explica useState + useEffect en video
export function useCitas(){ const [citas,setCitas]=useState([]); const [cargando,setCargando]=useState(false); const [error,setError]=useState('');
async function cargar(){ setCargando(true); setError(''); try{ const {data}=await api.get('/migraciones/citas/mias'); setCitas(Array.isArray(data)?data:[]);}catch(e){ setError(mensajeDeError(e)); }finally{ setCargando(false); } }
return {citas,cargando,error,cargar}; }
