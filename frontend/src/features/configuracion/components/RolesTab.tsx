import React from 'react';
import { Card } from '../../../components/ui/Card';
import { ShieldAlert, Users, Wrench, Crown, Check } from 'lucide-react';

// Documentación de los roles fijos del sistema (enum RolUsuario del backend).
// No es configurable: refleja lo que las reglas de seguridad ya permiten.
const ROLES = [
  {
    nombre: 'Administrador',
    descripcion: 'Acceso total a la administración',
    icon: ShieldAlert,
    colorFondo: '#EDE9FE',
    color: '#3730A3',
    capacidades: [
      'Gestionar usuarios y accesos',
      'Editar los datos de la empresa y sus cuentas bancarias',
      'Configurar los estados del flujo de reparación',
      'Registrar técnicos y administrar el inventario',
      'Ver y operar todas las órdenes del taller',
    ],
  },
  {
    nombre: 'Propietario',
    descripcion: 'Dueño del taller, mismos permisos que Administrador',
    icon: Crown,
    colorFondo: '#FEF3C7',
    color: '#D97706',
    capacidades: [
      'Todo lo que puede hacer un Administrador',
      'Gestionar la suscripción y los pagos a Kolvix',
      'Consultar los indicadores del negocio',
    ],
  },
  {
    nombre: 'Técnico',
    descripcion: 'Diagnóstico y reparaciones',
    icon: Wrench,
    colorFondo: '#E0F2FE',
    color: '#0369A1',
    capacidades: [
      'Ver las órdenes asignadas a su cola',
      'Registrar el diagnóstico técnico',
      'Seleccionar repuestos del inventario del taller',
      'Documentar el proceso con evidencia fotográfica',
    ],
  },
  {
    nombre: 'Recepcionista',
    descripcion: 'Atención al cliente e ingresos',
    icon: Users,
    colorFondo: '#DCFCE7',
    color: '#15803D',
    capacidades: [
      'Registrar clientes, dispositivos y nuevas órdenes',
      'Capturar la evidencia de recepción del equipo',
      'Dar seguimiento al estado de las reparaciones',
      'Registrar la entrega final al cliente',
    ],
  },
];

export const RolesTab: React.FC = () => (
  <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
    <div style={{
      backgroundColor: '#F4F0FF',
      border: '1px solid #EDE9FE',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '28px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <ShieldAlert size={20} color="#3730A3" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3', margin: 0 }}>Roles definidos por Kolvix</h4>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
          Los roles del sistema son fijos y no pueden modificarse. El rol se asigna al crear cada usuario
          desde la pestaña Usuarios (o desde el módulo de Técnicos).
        </p>
      </div>
    </div>

    <div className="grid-2">
      {ROLES.map((rol) => {
        const Icon = rol.icon;
        return (
          <Card key={rol.nombre} hoverable={false} style={{ border: '1px solid #E2E8F0', padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: rol.colorFondo,
                color: rol.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>{rol.nombre}</h4>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{rol.descripcion}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Capacidades</span>
              {rol.capacidades.map((cap) => (
                <div key={cap} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <Check size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  </Card>
);
