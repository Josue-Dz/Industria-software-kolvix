import apiClient from '../axiosConfig';
import type {
  PerfilMarketplace,
  CategoriaServicio,
  CategoriaDispositivo,
  Review,
  TallerCercano,
  PageResponse,
} from '../types'; // 

export const marketplaceApi = {
  listarTalleres: async (page = 0, size = 20): Promise<PageResponse<PerfilMarketplace>> => {
    const { data } = await apiClient.get('/marketplace/talleres', { params: { page, size } });
    return data;
  },

  buscarPorCategoria: async (categoriaId: number, page = 0, size = 20): Promise<PageResponse<PerfilMarketplace>> => {
    const { data } = await apiClient.get('/marketplace/talleres/buscar', {
      params: { categoriaId, page, size },
    });
    return data;
  },

  buscarPorUbicacion: async (lat: number, lng: number, radioKm = 10): Promise<TallerCercano[]> => {
    const { data } = await apiClient.get('/marketplace/talleres/cercanos', {
      params: { lat, lng, radioKm },
    });
    return data;
  },

  verPerfil: async (idEmpresa: number): Promise<PerfilMarketplace> => {
    const { data } = await apiClient.get(`/marketplace/talleres/${idEmpresa}`);
    return data;
  },

  categoriasDelTaller: async (idEmpresa: number): Promise<CategoriaServicio[]> => {
    const { data } = await apiClient.get(`/marketplace/talleres/${idEmpresa}/categorias`);
    return data;
  },

  reviewsDelTaller: async (idEmpresa: number): Promise<Review[]> => {
    const { data } = await apiClient.get(`/marketplace/talleres/${idEmpresa}/reviews`);
    return data;
  },

  catalogoCategorias: async (): Promise<CategoriaDispositivo[]> => {
    const { data } = await apiClient.get('/catalogos/categorias-dispositivo');
    return data;
  },
};