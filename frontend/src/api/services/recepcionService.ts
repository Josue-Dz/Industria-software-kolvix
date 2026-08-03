import apiClient from "../axiosConfig";
import type {
  ActualizarDetallesChecklistRequest,
  ChecklistRecepcionRequest,
  ChecklistRecepcionResponse,
  DanoFisico,
  PlantillaInspeccionResponse,
} from "../types";

const esNoEncontrado = (error: unknown): boolean => {
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as { response?: { status?: number } }).response?.status === 404;
  }
  return false;
};

export const recepcionService = {
  async registrar(request: ChecklistRecepcionRequest): Promise<ChecklistRecepcionResponse> {
    const { data } = await apiClient.post<ChecklistRecepcionResponse>("/recepcion/registrar", request);
    return data;
  },

  /** Devuelve null cuando la orden todavia no tiene checklist. */
  async obtenerPorOrden(ordenId: number, empresaId: number): Promise<ChecklistRecepcionResponse | null> {
    try {
      const { data } = await apiClient.get<ChecklistRecepcionResponse>(`/recepcion/orden/${ordenId}`, {
        params: { empresaId },
      });
      return data;
    } catch (error) {
      if (esNoEncontrado(error)) return null;
      throw error;
    }
  },

  async actualizarDanos(
    idChecklist: number,
    danosFisicos: DanoFisico[]
  ): Promise<ChecklistRecepcionResponse> {
    const { data } = await apiClient.patch<ChecklistRecepcionResponse>(
      `/recepcion/${idChecklist}/danos-fisicos`,
      { danosFisicos }
    );
    return data;
  },

  async actualizarObservaciones(
    idChecklist: number,
    observaciones: string
  ): Promise<ChecklistRecepcionResponse> {
    const { data } = await apiClient.patch<ChecklistRecepcionResponse>(
      `/recepcion/${idChecklist}/observaciones`,
      null,
      { params: { observaciones } }
    );
    return data;
  },

  async actualizarPlantilla(
    idChecklist: number,
    plantillaInspeccionId: number
  ): Promise<ChecklistRecepcionResponse> {
    const { data } = await apiClient.patch<ChecklistRecepcionResponse>(
      `/recepcion/${idChecklist}/plantilla-inspeccion`,
      null,
      { params: { plantillaInspeccionId } }
    );
    return data;
  },

  async actualizarDetalles(
    idChecklist: number,
    request: ActualizarDetallesChecklistRequest
  ): Promise<ChecklistRecepcionResponse> {
    const { data } = await apiClient.patch<ChecklistRecepcionResponse>(
      `/recepcion/${idChecklist}/detalles`,
      request
    );
    return data;
  },
};

export const plantillasInspeccionService = {
  async listar(categoriaId?: number | null): Promise<PlantillaInspeccionResponse[]> {
    const { data } = await apiClient.get<PlantillaInspeccionResponse[]>("/plantillas-inspeccion", {
      params: categoriaId ? { categoriaId } : undefined,
    });
    return data;
  },
};
