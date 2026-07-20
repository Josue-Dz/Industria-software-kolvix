import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL as string,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const isAuthMe = error.config?.url?.includes("/auth/me");
    if (error.response?.status === 401 && !isAuthMe) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;