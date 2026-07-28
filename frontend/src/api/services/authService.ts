import apiClient from "../axiosConfig";
import type { AuthResponse, LoginRequest, UsuarioResponse, EmpresaRegistroRequest,
  RegistroEmpresaResponse
 } from "../types";

const AUTH_USER_KEY = "kolvix:user";

export const authService = {
  async login(credentials: LoginRequest): Promise<UsuarioResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.usuario));
    return data.usuario;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    sessionStorage.removeItem(AUTH_USER_KEY);
  },


registrarEmpresa: async (data: EmpresaRegistroRequest): Promise<RegistroEmpresaResponse> => {
  const { data: response } = await apiClient.post('/auth/crear', data);
  return response;
},

  async getCurrentUser(): Promise<UsuarioResponse> {
    const { data } = await apiClient.get<UsuarioResponse>("/auth/me");
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
    return data;
  },

  getCachedUser(): UsuarioResponse | null {
    const rawUser = sessionStorage.getItem(AUTH_USER_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as UsuarioResponse;
    } catch {
      sessionStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
  },
};
