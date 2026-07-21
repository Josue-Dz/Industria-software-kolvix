import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  Settings, 
  Headset,
  Wrench,
  Camera,
  Stethoscope,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  userRole?: 'admin' | 'tecnico' | 'cliente';
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole = 'admin' }) => {
  const location = useLocation();

  const adminNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Órdenes', path: '/ordenes', icon: ClipboardList },
    { label: 'Inventario', path: '/inventario', icon: Package },
    { label: 'Configuración', path: '/configuracion', icon: Settings },
    { label: 'Soporte', path: '/soporte', icon: Headset }
  ];

  const tecnicoNavItems = [
    { label: 'Mis Trabajos', path: '/dashboard/tecnico', icon: Wrench },
    { label: 'Diagnóstico', path: '/ordenes/diagnostico', icon: Stethoscope },
    { label: 'Evidencia', path: '/ordenes/evidencia', icon: Camera }
  ];

  const navItems = userRole === 'tecnico' ? tecnicoNavItems : adminNavItems;

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#1E1B4B',
      color: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ padding: '0 12px 24px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <img
          src="/src/assets/logos/Logo 4.png"
          alt="Kolvix Logo"
          style={{ height: '32px', objectFit: 'contain', alignSelf: 'flex-start' }}
        />
        <span style={{ fontSize: '11px', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {userRole === 'tecnico' ? 'Panel Técnico' : 'Panel Taller'}
        </span>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
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
        <Link
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#F87171',
            transition: 'background-color 0.2s'
          }}
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
};
