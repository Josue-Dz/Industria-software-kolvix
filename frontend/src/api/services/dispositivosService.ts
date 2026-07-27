import apiClient from "../axiosConfig";
import type {
  CategoriaDispositivoResponse,
  DispositivoRequest,
  DispositivoResponse,
} from "../types";

export const dispositivosService = {
  async crear(request: DispositivoRequest): Promise<DispositivoResponse> {
    const { data } = await apiClient.post<DispositivoResponse>("/dispositivos", request);
    return data;
  },

  async listarPorCliente(clienteId: number): Promise<DispositivoResponse[]> {
    const { data } = await apiClient.get<DispositivoResponse[]>(`/dispositivos/cliente/${clienteId}`);
    return data;
  },

  async listarCategorias(): Promise<CategoriaDispositivoResponse[]> {
    const { data } = await apiClient.get<CategoriaDispositivoResponse[]>("/categorias-dispositivos");
    return data;
  },
};
