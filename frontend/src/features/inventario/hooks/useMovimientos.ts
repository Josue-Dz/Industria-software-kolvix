import { useCallback, useEffect, useState } from 'react';
import { movimientosInventarioService } from '../../../api/services/movimientosInventarioService';
import { getApiErrorMessage } from '../../../api/apiError';
import type { MovimientoInventarioResponse } from '../../../api/types';

export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState<MovimientoInventarioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  // Incrementar la versión vuelve a disparar el efecto de carga.
  const cargar = useCallback(() => setVersion(v => v + 1), []);

  useEffect(() => {
    let activo = true;

    const cargarMovimientos = async () => {
      try {
        const data = await movimientosInventarioService.listar();
        if (activo) {
          setMovimientos(data);
          setError('');
        }
      } catch (err) {
        if (activo) {
          setError(getApiErrorMessage(err, 'No se pudieron cargar los movimientos desde el backend.'));
        }
      } finally {
        if (activo) {
          setIsLoading(false);
        }
      }
    };

    void cargarMovimientos();

    return () => {
      activo = false;
    };
  }, [version]);

  const agregarMovimiento = (movimiento: MovimientoInventarioResponse) => {
    setMovimientos(prev => [movimiento, ...prev]);
  };

  return { movimientos, isLoading, error, setError, cargar, agregarMovimiento };
};
