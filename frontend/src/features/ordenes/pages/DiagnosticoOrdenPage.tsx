import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const DiagnosticoOrdenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      title="Ficha de Diagnóstico Técnico"
      subtitle="Orden #ORD-2026-089 — iPhone 13 Pro"
      role="tecnico"
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
          <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard/tecnico'); }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ backgroundColor: '#EDE9FE', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <AlertCircle size={24} color="#3730A3" />
              <div>
                <span style={{ fontWeight: '800', color: '#1E1B4B', display: 'block' }}>Cliente: Carlos Mendoza</span>
                <span style={{ fontSize: '13px', color: '#475569' }}>Falla inicial: Pantalla no da imagen y se calienta.</span>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B' }}>
              Diagnóstico del Técnico
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Detalle de la inspección técnica</label>
              <textarea
                className="input-field"
                rows={4}
                defaultValue="Se realizó prueba con multímetro. Cortocircuito leve detectado en la línea del display. Requiere reemplazo del módulo de pantalla OLED original."
              />
            </div>

            <div className="grid-2">
              <Input label="Costo Estimado de Repuestos ($)" defaultValue="120.00" type="number" />
              <Input label="Costo Mano de Obra ($)" defaultValue="35.00" type="number" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Estado Sugerido</label>
              <select className="input-field">
                <option>Aprobado para reparación</option>
                <option>En espera de repuestos</option>
                <option>Rechazado por el cliente</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/tecnico')}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" style={{ backgroundColor: '#3730A3' }} icon={<CheckCircle2 size={18} />}>
                Guardar Diagnóstico
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
