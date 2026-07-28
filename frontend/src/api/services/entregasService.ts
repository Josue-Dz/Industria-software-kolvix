import apiClient from "../axiosConfig";
import type { EntregaRequest, EntregaResponse } from "../types";

export const entregasService = {
  async registrar(empresaId: number, request: EntregaRequest): Promise<EntregaResponse> {
    const { data } = await apiClient.post<EntregaResponse>(
      `/ordenes-trabajo/empresa/${empresaId}/entregas`,
      request
    );
    return data;
  },

  async obtenerPorOrden(empresaId: number, ordenId: number): Promise<EntregaResponse | null> {
    try {
      const { data } = await apiClient.get<EntregaResponse>(
        `/ordenes-trabajo/empresa/${empresaId}/entregas/${ordenId}`
      );
      return data;
    } catch {
      return null; // aún no tiene entrega registrada
    }
  },
};