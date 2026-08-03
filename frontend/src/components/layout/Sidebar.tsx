import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import type { UserRole } from '../../api/types';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  Settings,
  Headset,
  Wrench,
  LogOut,
  type LucideIcon
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const MENU_TALLER: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Órdenes', path: '/ordenes', icon: ClipboardList },
  { label: 'Técnicos', path: '/tecnicos', icon: Users },
  { label: 'Inventario', path: '/inventario', icon: Package },
  { label: 'Configuración', path: '/configuracion', icon: Settings },
  { label: 'Soporte', path: '/soporte', icon: Headset }
];

const MENU_TECNICO: NavItem[] = [
  { label: 'Mis Trabajos', path: '/dashboard/tecnico', icon: Wrench },
  { label: 'Soporte', path: '/soporte', icon: Headset }
];

const MENU_POR_ROL: Record<UserRole, NavItem[]> = {
  ADMIN: MENU_TALLER,
  PROPIETARIO: MENU_TALLER,
  RECEPCIONISTA: MENU_TALLER,
  TECNICO: MENU_TECNICO
};

const ETIQUETA_PANEL: Record<UserRole, string> = {
  ADMIN: 'Panel Taller',
  PROPIETARIO: 'Panel Taller',
  RECEPCIONISTA: 'Panel Taller',
  TECNICO: 'Panel Técnico'
};

interface SidebarProps {
  /** Rol del usuario en sesión. null mientras no se sepa quién es. */
  rol: UserRole | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ rol }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cerrarSesion } = useAuth();
  const [cerrando, setCerrando] = useState(false);

  const handleCerrarSesion = async () => {
    setCerrando(true);
    try {
      await cerrarSesion();
      navigate('/login', { replace: true });
    } finally {
      setCerrando(false);
    }
  };

  const navItems = rol ? MENU_POR_ROL[rol] : [];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#1E1B4B',
      color: '#FFFFFF',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ padding: '0 12px 24px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <img
          src="/logos/Logo 4.png"
          alt="Kolvix Logo"
          style={{ height: '32px', objectFit: 'contain', alignSelf: 'flex-start' }}
        />
        <span style={{ fontSize: '11px', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {rol ? ETIQUETA_PANEL[rol] : ''}
        </span>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                backgroundColor: isActive ? '#3730A3' : 'transparent',
                color: isActive ? '#FFFFFF' : '#CBD5E1',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#A78BFA' : '#94A3B8'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={handleCerrarSesion}
          disabled={cerrando}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#F87171',
            backgroundColor: 'transparent',
            border: 'none',
            width: '100%',
            textAlign: 'left',
            cursor: cerrando ? 'wait' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          <LogOut size={18} />
          <span>{cerrando ? 'Cerrando...' : 'Cerrar Sesión'}</span>
        </button>
      </div>
    </aside>
  );
};
