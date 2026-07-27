import React from 'react';
import { Sidebar } from './Sidebar';
import { NotificationsBell } from './NotificationsBell';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  role?: 'admin' | 'tecnico' | 'cliente';
}

const ROL_LABEL: Record<string, string> = {
  ADMIN: 'Administrador',
  TECNICO: 'Técnico',
  RECEPCIONISTA: 'Recepcionista',
  PROPIETARIO: 'Propietario',
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  role = 'admin'
}) => {
  const usuario = useUsuarioActual();

  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario';
  const detalleUsuario = usuario
    ? `${ROL_LABEL[usuario.rol] ?? usuario.rol} · ${usuario.correo}`
    : 'Sesión no iniciada';
  const iniciales = usuario
    ? `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase()
    : '?';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar userRole={role} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '76px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <NotificationsBell />

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                {iniciales}
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E1B4B', display: 'block' }}>
                  {nombreCompleto}
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {detalleUsuario}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
