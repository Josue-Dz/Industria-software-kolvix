import apiClient from "../axiosConfig";
import type {
  AlbumEvidenciaResponse,
  ArchivoResponse,
  EvidenciaFotograficaRequest,
  EvidenciaFotograficaResponse,
} from "../types";

// Origen del backend sin el sufijo /api, para resolver rutas de imágenes (/uploads/...)
const BACKEND_ORIGIN = (import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:8080/api")
  .replace(/\/api\/?$/, "");

export const evidenciasService = {
  async listarAlbumes(): Promise<AlbumEvidenciaResponse[]> {
    const { data } = await apiClient.get<AlbumEvidenciaResponse[]>("/albumes-evidencia");
    return data;
  },

  async subirArchivo(archivo: File): Promise<ArchivoResponse> {
    const formData = new FormData();
    formData.append("archivo", archivo);
    const { data } = await apiClient.post<ArchivoResponse>("/archivos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async registrar(request: EvidenciaFotograficaRequest): Promise<EvidenciaFotograficaResponse> {
    const { data } = await apiClient.post<EvidenciaFotograficaResponse>(
      "/evidencias-fotograficas/subir",
      request
    );
    return data;
  },

  async listarPorOrden(ordenId: number): Promise<EvidenciaFotograficaResponse[]> {
    const { data } = await apiClient.get<EvidenciaFotograficaResponse[]>(
      `/evidencias-fotograficas/orden/${ordenId}`
    );
    return data;
  },

  resolverUrlImagen(urlImagen: string): string {
    if (urlImagen.startsWith("http://") || urlImagen.startsWith("https://")) {
      return urlImagen;
    }
    return `${BACKEND_ORIGIN}${urlImagen}`;
  },
};
