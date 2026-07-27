import apiClient from "../axiosConfig";
import type {
  DiagnosticoRepuestoRequest,
  DiagnosticoRepuestoResponse,
  DiagnosticoRequest,
  DiagnosticoResponse,
} from "../types";

export const diagnosticosService = {
  async crear(request: DiagnosticoRequest): Promise<DiagnosticoResponse> {
    const { data } = await apiClient.post<DiagnosticoResponse>("/diagnosticos", request);
    return data;
  },

  async editar(diagnosticoId: number, request: DiagnosticoRequest): Promise<DiagnosticoResponse> {
    const { data } = await apiClient.put<DiagnosticoResponse>(`/diagnosticos/${diagnosticoId}`, request);
    return data;
  },

  async obtenerPorOrden(ordenId: number): Promise<DiagnosticoResponse | null> {
    try {
      const { data } = await apiClient.get<DiagnosticoResponse>(`/diagnosticos/orden/${ordenId}`);
      return data;
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  async agregarRepuesto(
    diagnosticoId: number,
    request: DiagnosticoRepuestoRequest
  ): Promise<DiagnosticoRepuestoResponse> {
    const { data } = await apiClient.post<DiagnosticoRepuestoResponse>(
      `/diagnosticos/${diagnosticoId}/repuestos`,
      request
    );
    return data;
  },

  async eliminarRepuesto(repuestoDiagnosticoId: number): Promise<void> {
    await apiClient.delete(`/diagnosticos/repuestos/${repuestoDiagnosticoId}`);
  },
};
