import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import axios from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


type ManejadorSesionExpirada = () => void;

let alExpirarSesion: ManejadorSesionExpirada | null = null;

export const registrarManejadorSesionExpirada = (manejador: ManejadorSesionExpirada) => {
  alExpirarSesion = manejador;
  return () => {
    if (alExpirarSesion === manejador) {
      alExpirarSesion = null;
    }
  };
};


const RUTAS_SIN_SESION = ["/auth/login", "/auth/me"];

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    const esRutaDeSesion = RUTAS_SIN_SESION.some((ruta) => url.includes(ruta));

    if (error.response?.status === 401 && !esRutaDeSesion) {
      alExpirarSesion?.();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
