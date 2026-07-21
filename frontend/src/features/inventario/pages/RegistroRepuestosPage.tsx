import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

export const RegistroRepuestosPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('PRT-2005');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('OEM');
  const [cost, setCost] = useState('');
  const [qty, setQty] = useState('800');
  const [compatibility, setCompatibility] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/inventario');
  };

  return (
    <DashboardLayout
      title="Inventario"
      subtitle=""
      role="admin"
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Registro de Repuesto
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Siga cada campo para digitalizar el ingreso de nuevos repuestos.
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', marginTop: '16px' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>
              
              {/* Left Form Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-2">
                  <Input
                    label="NOMBRE DEL REPUESTO *"
                    placeholder="Ej. Pantalla OLED Premium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="CÓDIGO *"
                    placeholder="PRT-2005"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-3">
                  <div className="input-group">
                    <label className="input-label">MARCA *</label>
                    <select
                      className="input-field"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    >
                      <option value="OEM">OEM</option>
                      <option value="Original Apple">Original Apple</option>
                      <option value="Original Samsung">Original Samsung</option>
                      <option value="Genérico High-Copy">Genérico High-Copy</option>
                    </select>
                  </div>

                  <Input
                    label="COSTO UNITARIO *"
                    placeholder="Ej. L.1800"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                  />

                  <Input
                    label="CANTIDAD *"
                    placeholder="800"
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">COMPATIBILIDAD *</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Escriba con que dispositivos es compatible el repuesto"
                    value={compatibility}
                    onChange={(e) => setCompatibility(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Right Image Upload Section */}
              <div style={{
                backgroundColor: '#FAFAFD',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    2. Imagen del Repuesto
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Agregue una imagen del repuesto para facilitar su identificación en el inventario.
                  </p>
                </div>

                <Input
                  placeholder="Añadir una breve descripción (opcional)"
                />

                <div style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '14px',
                  padding: '36px 16px',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Upload size={32} color="#6366F1" />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Archivos compatibles: .jpg y .png
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/inventario')}
                style={{ backgroundColor: '#EDE9FE', color: '#3730A3', borderColor: 'transparent', borderRadius: '12px', padding: '12px 24px' }}
              >
                Cancelar Registro
              </Button>

              <Button
                type="submit"
                variant="primary"
                style={{ backgroundColor: '#3730A3', borderRadius: '12px', padding: '12px 32px' }}
                icon={<CheckCircle2 size={18} />}
              >
                Guardar registro
              </Button>
            </div>

          </form>

        </Card>
      </div>
    </DashboardLayout>
  );
};
