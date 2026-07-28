import apiClient from "../axiosConfig";
import type {
  CategoriaDispositivoResponse,
  CategoriaServicio,
  PerfilMarketplace,
  PerfilMarketplaceRequest,
} from "../types";

// Endpoints del taller sobre su propio perfil público (a diferencia de
// marketplace.ts, que consulta los perfiles publicados de otros talleres).
export const miTallerService = {
  // Devuelve null si la empresa todavía no tiene perfil creado: el backend
  // responde 404 hasta el primer guardado.
  async obtenerPerfil(): Promise<PerfilMarketplace | null> {
    try {
      const { data } = await apiClient.get<PerfilMarketplace>("/mi-taller/perfil-marketplace");
      return data;
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Crea el perfil si no existe y lo actualiza si ya existía.
  async guardarPerfil(request: PerfilMarketplaceRequest): Promise<PerfilMarketplace> {
    const { data } = await apiClient.put<PerfilMarketplace>("/mi-taller/perfil-marketplace", request);
    return data;
  },

  async cambiarVisibilidad(visible: boolean): Promise<PerfilMarketplace> {
    const { data } = await apiClient.patch<PerfilMarketplace>(
      "/mi-taller/perfil-marketplace/visibilidad",
      { visible }
    );
    return data;
  },

  async listarCategorias(): Promise<CategoriaServicio[]> {
    const { data } = await apiClient.get<CategoriaServicio[]>("/mi-taller/categorias-servicio");
    return data;
  },

  async agregarCategoria(categoriaId: number): Promise<CategoriaServicio> {
    const { data } = await apiClient.post<CategoriaServicio>("/mi-taller/categorias-servicio", { categoriaId });
    return data;
  },

  async quitarCategoria(id: number): Promise<void> {
    await apiClient.delete(`/mi-taller/categorias-servicio/${id}`);
  },

  // Catálogo global de categorías de dispositivo, para elegir cuáles atiende el taller.
  async listarCatalogoCategorias(): Promise<CategoriaDispositivoResponse[]> {
    const { data } = await apiClient.get<CategoriaDispositivoResponse[]>("/catalogos/categorias-dispositivo");
    return data;
  },
};
