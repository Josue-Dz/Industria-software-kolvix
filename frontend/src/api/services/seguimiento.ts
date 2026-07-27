import apiClient from '../axiosConfig';
import type { SeguimientoOrden } from '../types';

export const seguimientoApi = {
  consultar: async (codigo: string): Promise<SeguimientoOrden> => {
    const { data } = await apiClient.get(`/seguimiento/${codigo}`);
    return data;
  },

  crearReview: async (ordenId: number, clienteId: number, calificacion: number, comentario: string) => {
    const { data } = await apiClient.post('/seguimiento/reviews', {
      ordenId,
      clienteId,
      calificacion,
      comentario,
    });
    return data;
  },
};