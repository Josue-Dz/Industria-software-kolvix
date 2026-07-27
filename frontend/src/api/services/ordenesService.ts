import apiClient from "../axiosConfig";
import type {
  CambioEstadoOrdenRequest,
  EstadoReparacionResponse,
  OrdenTrabajoRequest,
  OrdenTrabajoResponse,
} from "../types";

export const ordenesService = {
  async crear(empresaId: number, request: OrdenTrabajoRequest): Promise<OrdenTrabajoResponse> {
    const { data } = await apiClient.post<OrdenTrabajoResponse>(
      `/ordenes-trabajo/empresa/${empresaId}`,
      request
    );
    return data;
  },

  async listarEstados(): Promise<EstadoReparacionResponse[]> {
    const { data } = await apiClient.get<EstadoReparacionResponse[]>("/estados-reparacion/enlistar");
    return data;
  },

  async listarPorEstado(empresaId: number, estadoReparacion: string): Promise<OrdenTrabajoResponse[]> {
    const { data } = await apiClient.get<OrdenTrabajoResponse[]>(
      `/ordenes-trabajo/empresa/${empresaId}/estado-reparacion`,
      { params: { estadoReparacion } }
    );
    return data;
  },

  async obtenerPorId(empresaId: number, ordenId: number): Promise<OrdenTrabajoResponse> {
    const { data } = await apiClient.get<OrdenTrabajoResponse>(
      `/ordenes-trabajo/empresa/${empresaId}/id/${ordenId}`
    );
    return data;
  },

  async listarTodas(empresaId: number): Promise<OrdenTrabajoResponse[]> {
    const { data } = await apiClient.get<OrdenTrabajoResponse[]>(
      `/ordenes-trabajo/empresa/${empresaId}`
    );
    return data;
  },

  async cambiarTecnico(
    empresaId: number,
    ordenId: number,
    tecnicoId: number
  ): Promise<OrdenTrabajoResponse> {
    const { data } = await apiClient.put<OrdenTrabajoResponse>(
      `/ordenes-trabajo/empresa/${empresaId}/${ordenId}/tecnico`,
      { idTecnico: tecnicoId }
    );
    return data;
  },

  async cambiarEstado(
    empresaId: number,
    ordenId: number,
    request: CambioEstadoOrdenRequest
  ): Promise<OrdenTrabajoResponse> {
    const { data } = await apiClient.patch<OrdenTrabajoResponse>(
      `/ordenes-trabajo/empresa/${empresaId}/${ordenId}/estado`,
      request
    );
    return data;
  },
};
