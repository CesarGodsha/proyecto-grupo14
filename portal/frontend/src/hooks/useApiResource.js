import { useEffect, useState } from 'react';
import { api, mensajeDeError } from '../api/client.js';

export default function useApiResource(endpoint) {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(Boolean(endpoint));
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    if (!endpoint) {
      setData([]);
      setCargando(false);
      setError('');
      return () => {
        activo = false;
      };
    }

    setCargando(true);
    setError('');
    api.get(endpoint)
      .then(({ data: respuesta }) => {
        if (activo) setData(Array.isArray(respuesta) ? respuesta : []);
      })
      .catch((err) => {
        if (activo) setError(mensajeDeError(err));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [endpoint, version]);

  return {
    data,
    cargando,
    error,
    recargar: () => setVersion((actual) => actual + 1),
  };
}
