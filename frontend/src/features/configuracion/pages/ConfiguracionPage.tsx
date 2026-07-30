import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import {
  Building2,
  Users,
  ShieldAlert,
  Layers,
  CreditCard,
  Store,
  Plug,
  Check,
  AlertCircle
} from 'lucide-react';
import { useConfiguracion, type ConfigTab } from '../useConfiguracion';
import { EmpresaTab } from '../components/EmpresaTab';
import { UsuariosTab } from '../components/UsuariosTab';
import { RolesTab } from '../components/RolesTab';
import { EstadosTab } from '../components/EstadosTab';
import { SuscripcionTab } from '../components/SuscripcionTab';
import { MarketplaceTab } from '../components/MarketplaceTab';
import { IntegracionesTab } from '../components/IntegracionesTab';

const NAV_ITEMS: { id: ConfigTab; label: string; icon: React.ElementType }[] = [
  { id: 'empresa', label: 'Empresa', icon: Building2 },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'roles', label: 'Roles y permisos', icon: ShieldAlert },
  { id: 'estados', label: 'Estados del flujo', icon: Layers },
  { id: 'suscripcion', label: 'Suscripción', icon: CreditCard },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'integraciones', label: 'Integraciones', icon: Plug },
];

export const ConfiguracionPage: React.FC = () => {
  const c = useConfiguracion();
  const { activeTab, setActiveTab, empresa, usuarioActual, isLoading, loadError, toastMessage, errorMessage } = c;

  return (
    <DashboardLayout
      title="Configuración"
      subtitle={empresa ? `${empresa.nombre} · Plan ${empresa.nombrePlan}` : ''}
      role="admin"
    >
      {/* Aviso flotante de resultado de la última acción */}
      {(toastMessage || errorMessage) && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '32px',
          backgroundColor: errorMessage ? '#991B1B' : '#1E1B4B',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(30, 27, 75, 0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: '600',
          maxWidth: '420px',
          borderLeft: `4px solid ${errorMessage ? '#FCA5A5' : '#6366F1'}`
        }}>
          {errorMessage ? <AlertCircle size={18} color="#FCA5A5" /> : <Check size={18} color="#A78BFA" />}
          <span>{errorMessage ?? toastMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Configuración
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
            {usuarioActual
              ? `Sesión de ${usuarioActual.nombre} ${usuarioActual.apellido} · ${usuarioActual.rol}`
              : 'Preferencias del taller'}
          </p>
        </div>

        {isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando configuración desde el backend...
          </Card>
        )}

        {loadError && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {loadError}
          </Card>
        )}

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* Menú interno */}
          <Card hoverable={false} style={{
            width: '280px',
            flexShrink: 0,
            padding: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            position: 'sticky',
            top: '24px'
          }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '600',
                    backgroundColor: isActive ? '#F4F0FF' : 'transparent',
                    color: isActive ? '#3730A3' : '#64748B',
                    textAlign: 'left',
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#6366F1' : '#94A3B8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </Card>

          {/* Contenido de la pestaña activa */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeTab === 'empresa' && <EmpresaTab c={c} />}
            {activeTab === 'usuarios' && <UsuariosTab c={c} />}
            {activeTab === 'roles' && <RolesTab />}
            {activeTab === 'estados' && <EstadosTab c={c} />}
            {activeTab === 'suscripcion' && <SuscripcionTab c={c} />}
            {activeTab === 'marketplace' && <MarketplaceTab c={c} />}
            {activeTab === 'integraciones' && <IntegracionesTab />}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
