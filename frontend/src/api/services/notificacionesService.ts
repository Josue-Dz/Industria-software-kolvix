import apiClient from "../axiosConfig";
import type { NotificacionResponse } from "../types";

export const notificacionesService = {
  async listarPendientes(): Promise<NotificacionResponse[]> {
    const { data } = await apiClient.get<NotificacionResponse[]>("/notificaciones/pendientes");
    return data;
  },

  async listarPorOrden(ordenId: number): Promise<NotificacionResponse[]> {
    const { data } = await apiClient.get<NotificacionResponse[]>(`/notificaciones/orden/${ordenId}`);
    return data;
  },
};
