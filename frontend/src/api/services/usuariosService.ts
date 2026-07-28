import apiClient from "../axiosConfig";
import type { UsuarioRequest, UsuarioResponse } from "../types";

export const usuariosService = {
  async listar(): Promise<UsuarioResponse[]> {
    const { data } = await apiClient.get<UsuarioResponse[]>("/usuarios");
    return data;
  },

  async crear(request: UsuarioRequest): Promise<UsuarioResponse> {
    const { data } = await apiClient.post<UsuarioResponse>("/usuarios", request);
    return data;
  },

  async cambiarEstado(usuarioId: number, activo: boolean): Promise<UsuarioResponse> {
    const { data } = await apiClient.patch<UsuarioResponse>(`/usuarios/${usuarioId}/estado`, { activo });
    return data;
  },
};
