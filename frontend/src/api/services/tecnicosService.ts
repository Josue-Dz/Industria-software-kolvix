import apiClient from "../axiosConfig";
import type {
  CargaTecnicoResponse,
  PageResponse,
  TecnicoRegistroRequest,
  TecnicoResponse,
} from "../types";

export const tecnicosService = {
  // Técnicos activos con sus órdenes abiertas, del menos al más cargado.
  async listarCarga(): Promise<CargaTecnicoResponse[]> {
    const { data } = await apiClient.get<CargaTecnicoResponse[]>("/tecnicos/carga");
    return data;
  },

  async listar(): Promise<TecnicoResponse[]> {
    const { data } = await apiClient.get<PageResponse<TecnicoResponse>>("/tecnicos/enlistar", {
      params: { size: 100 },
    });
    return data.content;
  },

  async registrar(payload: TecnicoRegistroRequest): Promise<TecnicoResponse> {
    const { data } = await apiClient.post<TecnicoResponse>("/tecnicos/registrar", payload);
    return data;
  },

  async cambiarEstado(idTecnico: number, activo: boolean): Promise<TecnicoResponse> {
    const { data } = await apiClient.patch<TecnicoResponse>(`/tecnicos/${idTecnico}/estado`, { activo });
    return data;
  },

    obtenerMiPerfil: async (): Promise<TecnicoResponse> => {
    const { data } = await apiClient.get('/tecnicos/me');
    return data;
 },
};
