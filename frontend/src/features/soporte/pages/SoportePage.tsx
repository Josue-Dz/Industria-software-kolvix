import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Mail, Phone, Video, HelpCircle } from 'lucide-react';


const CONTACTO_SOPORTE = {
  whatsapp: '',          
  correo: '',            
  urlDocumentacion: '',  
};

const soloDigitos = (telefono: string): string => telefono.replace(/\D/g, '');

export const SoportePage: React.FC = () => {
  const hayCanales = Boolean(
    CONTACTO_SOPORTE.whatsapp || CONTACTO_SOPORTE.correo || CONTACTO_SOPORTE.urlDocumentacion
  );

  return (
    <DashboardLayout
      title="Soporte"
      subtitle="Asistencia y documentación"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Page title and description */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Centro de soporte
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
            Encuentra ayuda para operar Kolvix y contacta al equipo técnico.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'flex-start' }}>

          {/* Left Column: Tutoriales */}
          <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Video size={20} color="#3730A3" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                Tutoriales en video
              </h3>
            </div>

            <div style={{
              border: '1px dashed #CBD5E1',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: '#FAFAFD'
            }}>
              <Video size={32} color="#94A3B8" />
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#475569', margin: '12px 0 4px 0' }}>
                Próximamente
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Estamos preparando los tutoriales en video de la plataforma.
              </p>
            </div>
          </Card>

          {/* Right Column: Canales de contacto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {CONTACTO_SOPORTE.whatsapp && (
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <Phone size={20} color="#10B981" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>WhatsApp soporte</h4>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      Para incidencias operativas o de facturación.
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${soloDigitos(CONTACTO_SOPORTE.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="accent" style={{ width: '100%', borderRadius: '10px', backgroundColor: '#10B981', borderColor: '#10B981' }}>
                    {CONTACTO_SOPORTE.whatsapp}
                  </Button>
                </a>
              </Card>
            )}

            {CONTACTO_SOPORTE.correo && (
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <Mail size={20} color="#6366F1" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Soporte por correo</h4>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Escríbenos y te respondemos por este medio.
                    </p>
                  </div>
                </div>
                <a
                  href={`mailto:${CONTACTO_SOPORTE.correo}`}
                  style={{ fontSize: '14px', fontWeight: '700', color: '#3730A3', display: 'block', padding: '4px 0' }}
                >
                  {CONTACTO_SOPORTE.correo}
                </a>
              </Card>
            )}

            {CONTACTO_SOPORTE.urlDocumentacion && (
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FAFAFD', border: '1px dashed #CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <HelpCircle size={16} color="#64748B" />
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', margin: 0 }}>Documentación</h4>
                </div>
                <a
                  href={CONTACTO_SOPORTE.urlDocumentacion}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '13px', fontWeight: '700', color: '#3730A3', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Ir a documentación →
                </a>
              </Card>
            )}

            {!hayCanales && (
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FAFAFD', border: '1px dashed #CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <HelpCircle size={16} color="#64748B" />
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', margin: 0 }}>Canales de soporte</h4>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Estamos habilitando los canales de atención. Muy pronto encontrarás aquí
                  los medios de contacto con el equipo de Kolvix.
                </p>
              </Card>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
