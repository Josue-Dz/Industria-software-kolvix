import React from 'react';
import { Card } from '../../../components/ui/Card';
import { MessageSquare, Mail, FileText, Construction } from 'lucide-react';

// Módulos que todavía no tienen respaldo en la base de datos ni endpoints.
// Se listan explícitamente para no mostrar credenciales o datos fiscales falsos.
const PENDIENTES = [
  {
    nombre: 'WhatsApp Business',
    icon: MessageSquare,
    detalle: 'Envío de cotizaciones y avisos de cambio de estado por WhatsApp.',
    falta: 'Requiere guardar el token y las plantillas de Meta, y un servicio que consuma la tabla notificaciones.',
  },
  {
    nombre: 'Correo (SMTP)',
    icon: Mail,
    detalle: 'Notificaciones por correo al cliente cuando su reparación avanza.',
    falta: 'Requiere credenciales SMTP configurables y el envío real desde el backend.',
  },
  {
    nombre: 'Facturación',
    icon: FileText,
    detalle: 'Datos fiscales, series y folios para los comprobantes.',
    falta: 'No existe tabla de datos fiscales en la base de datos; hoy solo se guarda el RTN de la empresa.',
  },
];

export const IntegracionesTab: React.FC = () => (
  <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
    <div style={{
      backgroundColor: '#FFFBEB',
      border: '1px solid #FDE68A',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '28px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <Construction size={20} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#92400E', margin: 0 }}>
          Módulos pendientes de implementar
        </h4>
        <p style={{ fontSize: '13px', color: '#92400E', margin: '4px 0 0 0', lineHeight: 1.4 }}>
          Estas integraciones todavía no tienen endpoints ni tablas en la base de datos, así que no hay
          nada que configurar aún. Se listan aquí para dejar claro qué falta del MVP.
        </p>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {PENDIENTES.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.nombre} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '20px',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FAFAFD'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>{item.nombre}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  backgroundColor: '#F1F5F9',
                  color: '#64748B'
                }}>
                  NO DISPONIBLE
                </span>
              </div>
              <span style={{ fontSize: '13px', color: '#475569', display: 'block', marginTop: '2px' }}>
                {item.detalle}
              </span>
              <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginTop: '6px' }}>
                Falta: {item.falta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);
