import apiClient from "../axiosConfig";
import type { RepuestoRequest, RepuestoResponse } from "../types";

export const repuestosService = {
  async listar(): Promise<RepuestoResponse[]> {
    const { data } = await apiClient.get<RepuestoResponse[]>("/repuestos");
    return data;
  },

  async crear(request: RepuestoRequest): Promise<RepuestoResponse> {
    const { data } = await apiClient.post<RepuestoResponse>("/repuestos", request);
    return data;
  },

  async editar(repuestoId: number, request: RepuestoRequest): Promise<RepuestoResponse> {
    const { data } = await apiClient.put<RepuestoResponse>(`/repuestos/${repuestoId}`, request);
    return data;
  },
};
