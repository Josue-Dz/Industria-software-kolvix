import { createContext } from 'react';
import type { LoginRequest, UsuarioResponse, UserRole } from '../api/types';

// 'cargando' es el estado inicial obligatorio: la cookie de sesión es httpOnly,
// así que JavaScript no puede leerla y hay que preguntarle al backend quién es
// el usuario antes de decidir si se muestra una pantalla privada.
export type EstadoSesion = 'cargando' | 'autenticado' | 'anonimo';

export interface AuthContextValor {
  usuario: UsuarioResponse | null;
  estado: EstadoSesion;
  iniciarSesion: (credenciales: LoginRequest) => Promise<UsuarioResponse>;
  cerrarSesion: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValor | null>(null);

// Pantalla de inicio según el rol, para no mandar a un técnico al panel de taller.
export const rutaInicialPorRol = (rol: UserRole): string =>
  rol === 'TECNICO' ? '/dashboard/tecnico' : '/dashboard';
