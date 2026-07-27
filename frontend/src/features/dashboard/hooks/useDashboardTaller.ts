import { useEffect, useState } from 'react';
import { authService } from '../../../api/services/authService';
import { ordenesService } from '../../../api/services/ordenesService';
import { repuestosService } from '../../../api/services/repuestosService';
import type { EstadoReparacionResponse, OrdenTrabajoResponse, RepuestoResponse } from '../../../api/types';

export const useDashboardTaller = () => {
  const [ordenes, setOrdenes] = useState<OrdenTrabajoResponse[]>([]);
  const [estados, setEstados] = useState<EstadoReparacionResponse[]>([]);
  const [repuestos, setRepuestos] = useState<RepuestoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarDashboard = async () => {
      try {
        const usuario = authService.getCachedUser() ?? await authService.getCurrentUser();
        const [ordenesR, estadosR, repuestosR] = await Promise.allSettled([
          ordenesService.listarTodas(usuario.empresaId),
          ordenesService.listarEstados(),
          repuestosService.listar(),
        ]);

        if (!activo) return;

        if (ordenesR.status === 'fulfilled') setOrdenes(ordenesR.value);
        if (estadosR.status === 'fulfilled') setEstados(estadosR.value);
        if (repuestosR.status === 'fulfilled') setRepuestos(repuestosR.value);

        if (ordenesR.status === 'rejected') {
          setError('No se pudieron cargar las órdenes desde el backend.');
        }
      } catch {
        if (activo) {
          setError('No se pudo cargar el dashboard. Verifica tu sesión y que el backend esté activo.');
        }
      } finally {
        if (activo) {
          setIsLoading(false);
        }
      }
    };

    void cargarDashboard();

    return () => {
      activo = false;
    };
  }, []);

  return { ordenes, estados, repuestos, isLoading, error };
};
