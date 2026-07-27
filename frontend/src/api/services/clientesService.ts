import apiClient from "../axiosConfig";
import type { ClienteRequest, ClienteResponse } from "../types";

export const clientesService = {
  async crear(empresaId: number, request: ClienteRequest): Promise<ClienteResponse> {
    const { data } = await apiClient.post<ClienteResponse>(
      `/clientes/empresa/${empresaId}`,
      request
    );
    return data;
  },

  async listar(empresaId: number): Promise<ClienteResponse[]> {
    const { data } = await apiClient.get<ClienteResponse[]>(`/clientes/empresa/${empresaId}`);
    return data;
  },
};
