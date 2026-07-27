import apiClient from "../axiosConfig";
import type {
  CotizacionDecisionRequest,
  CotizacionRequest,
  CotizacionResponse,
} from "../types";

export const cotizacionesService = {
  async generar(request: CotizacionRequest): Promise<CotizacionResponse> {
    const { data } = await apiClient.post<CotizacionResponse>("/cotizaciones", request);
    return data;
  },

  async editarBorrador(cotizacionId: number, request: CotizacionRequest): Promise<CotizacionResponse> {
    const { data } = await apiClient.put<CotizacionResponse>(
      `/cotizaciones/${cotizacionId}/borrador`,
      request
    );
    return data;
  },

  async enviar(cotizacionId: number): Promise<CotizacionResponse> {
    const { data } = await apiClient.post<CotizacionResponse>(`/cotizaciones/${cotizacionId}/enviar`);
    return data;
  },

  async registrarDecision(
    cotizacionId: number,
    request: CotizacionDecisionRequest
  ): Promise<CotizacionResponse> {
    const { data } = await apiClient.post<CotizacionResponse>(
      `/cotizaciones/${cotizacionId}/decision`,
      request
    );
    return data;
  },

  async listarPorOrden(ordenId: number): Promise<CotizacionResponse[]> {
    const { data } = await apiClient.get<CotizacionResponse[]>(`/cotizaciones/orden/${ordenId}`);
    return data;
  },
};
