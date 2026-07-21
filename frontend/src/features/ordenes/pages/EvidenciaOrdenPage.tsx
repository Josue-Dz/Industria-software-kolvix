import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Camera, Upload, CheckCircle2 } from 'lucide-react';

export const EvidenciaOrdenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      title="Registro de Evidencia Visual"
      subtitle="Fotografías de ingreso y reparación para la orden #ORD-2026-089"
      role="tecnico"
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={20} color="#6366F1" /> Evidencia Fotográfica de Ingreso
            </h3>

            {/* Upload Box */}
            <div style={{
              border: '2px dashed #A78BFA',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer'
            }}>
              <Upload size={36} color="#6366F1" style={{ marginBottom: '12px' }} />
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B', display: 'block' }}>
                Haz clic o arrastra fotos del equipo aquí
              </span>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Formatos soportados: PNG, JPG (Máx 10MB)</span>
            </div>

            {/* Image Preview Grid */}
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>Fotos adjuntadas</h4>

            <div className="grid-3">
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '140px', backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#3730A3' }}>Foto_Frontal.jpg</span>
              </div>
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '140px', backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#3730A3' }}>Foto_Trasera.jpg</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button variant="outline" onClick={() => navigate('/dashboard/tecnico')}>
                Volver a Mis Trabajos
              </Button>
              <Button variant="primary" style={{ backgroundColor: '#3730A3' }} icon={<CheckCircle2 size={18} />} onClick={() => navigate('/dashboard/tecnico')}>
                Guardar Evidencia
              </Button>
            </div>

          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
