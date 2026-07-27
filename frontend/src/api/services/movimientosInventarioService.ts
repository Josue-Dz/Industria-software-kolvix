import apiClient from "../axiosConfig";
import type {
  MovimientoInventarioRequest,
  MovimientoInventarioResponse,
  TipoMovimientoInventario,
} from "../types";

export const movimientosInventarioService = {
  async listar(filtros?: { repuestoId?: number; tipo?: TipoMovimientoInventario }): Promise<MovimientoInventarioResponse[]> {
    const { data } = await apiClient.get<MovimientoInventarioResponse[]>("/movimientos-inventario", {
      params: filtros,
    });
    return data;
  },

  async registrar(request: MovimientoInventarioRequest): Promise<MovimientoInventarioResponse> {
    const { data } = await apiClient.post<MovimientoInventarioResponse>("/movimientos-inventario", request);
    return data;
  },
};
