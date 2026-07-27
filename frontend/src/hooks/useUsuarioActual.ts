import { useEffect, useState } from 'react';
import { authService } from '../api/services/authService';
import type { UsuarioResponse } from '../api/types';

// Devuelve el usuario logueado: primero el caché de sesión (render inmediato)
// y luego lo refresca contra el backend.
export const useUsuarioActual = () => {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(() => authService.getCachedUser());

  useEffect(() => {
    let activo = true;

    const cargarUsuario = async () => {
      try {
        const data = await authService.getCurrentUser();
        if (activo) {
          setUsuario(data);
        }
      } catch {
        // Sin sesión activa: se conserva el caché (o null) sin romper la vista.
      }
    };

    void cargarUsuario();

    return () => {
      activo = false;
    };
  }, []);

  return usuario;
};
