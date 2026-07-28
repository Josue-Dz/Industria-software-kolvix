import apiClient from "../axiosConfig";
import type { EstadoReparacionRequest, EstadoReparacionResponse } from "../types";

export const estadosReparacionService = {
  async listar(): Promise<EstadoReparacionResponse[]> {
    const { data } = await apiClient.get<EstadoReparacionResponse[]>("/estados-reparacion/enlistar");
    return data;
  },

  async crear(request: EstadoReparacionRequest): Promise<EstadoReparacionResponse> {
    const { data } = await apiClient.post<EstadoReparacionResponse>("/estados-reparacion/crearEstado", request);
    return data;
  },

  async editar(estadoId: number, request: EstadoReparacionRequest): Promise<EstadoReparacionResponse> {
    const { data } = await apiClient.put<EstadoReparacionResponse>(`/estados-reparacion/${estadoId}`, request);
    return data;
  },
};
