import apiClient from "../axiosConfig";
import type { PageResponse, TecnicoRegistroRequest, TecnicoResponse } from "../types";

export const tecnicosService = {
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
};
