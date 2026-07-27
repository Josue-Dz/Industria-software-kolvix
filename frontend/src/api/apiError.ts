// Extrae el mensaje de error que envía el backend (si existe) con un fallback amigable.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as { response?: { data?: { message?: string } } };
  return axiosError?.response?.data?.message ?? fallback;
};
