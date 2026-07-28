import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { rutaInicialPorRol } from './authContext';
import { PantallaCargando } from './PantallaCargando';
import type { UserRole } from '../api/types';

interface RutaProtegidaProps {
  children: React.ReactNode;
  /** Si se indica, solo estos roles pueden entrar. */
  roles?: UserRole[];
}

// Guarda de las pantallas privadas.
//
// Importante: esto es control de INTERFAZ, no de seguridad. Sirve para no
// mostrar pantallas que el usuario no puede usar, pero cualquiera puede saltarse
// el frontend y llamar a la API directamente. La autorización real vive en el
// backend (SecurityConfig y los servicios); estos guardas solo la reflejan.
export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ children, roles }) => {
  const { usuario, estado } = useAuth();
  const location = useLocation();

  // Mientras se comprueba la sesión no se decide nada: pintar el contenido
  // privado aquí lo dejaría visible un instante a quien no ha iniciado sesión.
  if (estado === 'cargando') {
    return <PantallaCargando />;
  }

  if (estado === 'anonimo' || !usuario) {
    // Se recuerda a dónde iba para volver ahí después de iniciar sesión.
    return <Navigate to="/login" state={{ desde: location.pathname + location.search }} replace />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={rutaInicialPorRol(usuario.rol)} replace />;
  }

  return <>{children}</>;
};
