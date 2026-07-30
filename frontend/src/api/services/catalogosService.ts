import apiClient from "../axiosConfig";
import type { PlanSuscripcionResponse } from "../types";

// Catálogos públicos: no requieren sesión iniciada.
export const catalogosService = {
  async listarPlanes(): Promise<PlanSuscripcionResponse[]> {
    const { data } = await apiClient.get<PlanSuscripcionResponse[]>("/catalogos/planes");
    return data;
  },
};
