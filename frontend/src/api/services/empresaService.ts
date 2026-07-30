import apiClient from "../axiosConfig";
import type {
  CuentaCobroResponse,
  CuentaPagoTallerRequest,
  CuentaPagoTallerResponse,
  EmpresaResponse,
  EmpresaUpdateRequest,
  PlanSuscripcionResponse,
} from "../types";

export const empresaService = {
  async obtener(): Promise<EmpresaResponse> {
    const { data } = await apiClient.get<EmpresaResponse>("/empresa/mi-empresa");
    return data;
  },

  async actualizar(request: EmpresaUpdateRequest): Promise<EmpresaResponse> {
    const { data } = await apiClient.put<EmpresaResponse>("/empresa/mi-empresa", request);
    return data;
  },

  async listarPlanes(): Promise<PlanSuscripcionResponse[]> {
    const { data } = await apiClient.get<PlanSuscripcionResponse[]>("/empresa/planes");
    return data;
  },

  // Cuentas donde el taller paga su suscripción a Kolvix.
  async listarCuentasCobro(): Promise<CuentaCobroResponse[]> {
    const { data } = await apiClient.get<CuentaCobroResponse[]>("/empresa/cuentas-cobro");
    return data;
  },

  // Cuentas donde los clientes del taller le pagan a él.
  async listarCuentasPago(): Promise<CuentaPagoTallerResponse[]> {
    const { data } = await apiClient.get<CuentaPagoTallerResponse[]>("/cuentas-pago-taller");
    return data;
  },

  async crearCuentaPago(request: CuentaPagoTallerRequest): Promise<CuentaPagoTallerResponse> {
    const { data } = await apiClient.post<CuentaPagoTallerResponse>("/cuentas-pago-taller/crear", request);
    return data;
  },

  async cambiarEstadoCuentaPago(cuentaId: number, activo: boolean): Promise<CuentaPagoTallerResponse> {
    const { data } = await apiClient.patch<CuentaPagoTallerResponse>(
      `/cuentas-pago-taller/${cuentaId}/estado`,
      { activo }
    );
    return data;
  },
};
