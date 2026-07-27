import { useCallback, useEffect, useState } from 'react';
import { repuestosService } from '../../../api/services/repuestosService';
import { getApiErrorMessage } from '../../../api/apiError';
import type { RepuestoRequest, RepuestoResponse } from '../../../api/types';

export const useRepuestos = () => {
  const [repuestos, setRepuestos] = useState<RepuestoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  // Incrementar la versión vuelve a disparar el efecto de carga.
  const cargar = useCallback(() => setVersion(v => v + 1), []);

  useEffect(() => {
    let activo = true;

    const cargarRepuestos = async () => {
      try {
        const data = await repuestosService.listar();
        if (activo) {
          setRepuestos(data);
          setError('');
        }
      } catch (err) {
        if (activo) {
          setError(getApiErrorMessage(err, 'No se pudieron cargar los repuestos desde el backend.'));
        }
      } finally {
        if (activo) {
          setIsLoading(false);
        }
      }
    };

    void cargarRepuestos();

    return () => {
      activo = false;
    };
  }, [version]);

  const crear = async (request: RepuestoRequest): Promise<RepuestoResponse> => {
    const creado = await repuestosService.crear(request);
    setRepuestos(prev => [creado, ...prev]);
    return creado;
  };

  const desactivar = async (repuesto: RepuestoResponse): Promise<void> => {
    await repuestosService.editar(repuesto.id, {
      nombre: repuesto.nombre,
      codigo: repuesto.codigo ?? undefined,
      marca: repuesto.marca ?? undefined,
      stockActual: repuesto.stockActual,
      stockMinimo: repuesto.stockMinimo,
      precioCosto: repuesto.precioCosto,
      precioVenta: repuesto.precioVenta,
      activo: false,
    });
    setRepuestos(prev => prev.filter(r => r.id !== repuesto.id));
  };

  return { repuestos, isLoading, error, setError, cargar, crear, desactivar };
};
