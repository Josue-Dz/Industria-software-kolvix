import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { rutaInicialPorRol } from './authContext';
import { PantallaCargando } from './PantallaCargando';

// Login y registro: quien ya tiene sesión no debería volver a verlos, se le
// manda a su panel.
export const RutaSoloInvitados: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, estado } = useAuth();

  if (estado === 'cargando') {
    return <PantallaCargando />;
  }

  if (estado === 'autenticado' && usuario) {
    return <Navigate to={rutaInicialPorRol(usuario.rol)} replace />;
  }

  return <>{children}</>;
};
