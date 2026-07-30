import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../api/services/authService';
import { registrarManejadorSesionExpirada } from '../api/axiosConfig';
import { AuthContext, type EstadoSesion } from './authContext';
import type { LoginRequest, UsuarioResponse } from '../api/types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [estado, setEstado] = useState<EstadoSesion>('cargando');

  // Al arrancar se le pregunta al backend por la sesión. No se confía en el
  // usuario guardado en sessionStorage para decidir el acceso: ese dato lo puede
  // editar cualquiera desde el navegador. La cookie httpOnly es la única prueba.
  useEffect(() => {
    let montado = true;

    authService.getCurrentUser()
      .then((actual) => {
        if (!montado) return;
        setUsuario(actual);
        setEstado('autenticado');
      })
      .catch(() => {
        if (!montado) return;
        authService.limpiarSesion();
        setUsuario(null);
        setEstado('anonimo');
      });

    return () => {
      montado = false;
    };
  }, []);

  // Cuando cualquier petición responde 401, la sesión dejó de ser válida
  // (normalmente porque venció el token). Se limpia el estado y los guardas de
  // ruta se encargan de mandar al login.
  useEffect(() => {
    return registrarManejadorSesionExpirada(() => {
      authService.limpiarSesion();
      setUsuario(null);
      setEstado('anonimo');
    });
  }, []);

  const iniciarSesion = useCallback(async (credenciales: LoginRequest) => {
    const autenticado = await authService.login(credenciales);
    setUsuario(autenticado);
    setEstado('autenticado');
    return autenticado;
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      // Importa que el backend borre la cookie: sin esto la sesión seguiría
      // viva en el servidor aunque la interfaz mostrara al usuario desconectado.
      await authService.logout();
    } finally {
      authService.limpiarSesion();
      setUsuario(null);
      setEstado('anonimo');
    }
  }, []);

  const valor = useMemo(
    () => ({ usuario, estado, iniciarSesion, cerrarSesion }),
    [usuario, estado, iniciarSesion, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};
