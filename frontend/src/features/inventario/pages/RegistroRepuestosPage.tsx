import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { repuestosService } from '../../../api/services/repuestosService';
import { getApiErrorMessage } from '../../../api/apiError';

export const RegistroRepuestosPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [marca, setMarca] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      await repuestosService.crear({
        nombre: nombre.trim(),
        codigo: codigo.trim() || undefined,
        marca: marca.trim() || undefined,
        stockActual: Number(stockActual),
        stockMinimo: Number(stockMinimo || 0),
        precioCosto: Number(precioCosto),
        precioVenta: Number(precioVenta),
        activo: true,
      });
      navigate('/inventario');
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'No se pudo registrar el repuesto. Verifica los datos.'));
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="Inventario" subtitle="">
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

          {formError && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700', fontSize: '13px', marginBottom: '20px' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>

              {/* Left: Datos generales */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  1. Datos del Repuesto
                </h4>

                <Input
                  label="NOMBRE DEL REPUESTO *"
                  placeholder="Ej. Pantalla OLED Premium iPhone 13 Pro Max"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  maxLength={100}
                  required
                />

                <div className="grid-2">
                  <Input
                    label="CÓDIGO"
                    placeholder="Ej. PRT-2005 (opcional)"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    maxLength={80}
                  />
                  <Input
                    label="MARCA"
                    placeholder="Ej. OEM, Original Apple (opcional)"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    maxLength={80}
                  />
                </div>
              </div>

              {/* Right: Stock y precios */}
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
                    2. Stock y Precios
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Cuando el stock actual llegue al mínimo, se marcará como crítico en el catálogo.
                  </p>
                </div>

                <div className="grid-2">
                  <Input
                    label="STOCK INICIAL *"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={stockActual}
                    onChange={(e) => setStockActual(e.target.value)}
                    required
                  />
                  <Input
                    label="STOCK MÍNIMO"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="PRECIO COSTO (L.) *"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Ej. 1400.00"
                    value={precioCosto}
                    onChange={(e) => setPrecioCosto(e.target.value)}
                    required
                  />
                  <Input
                    label="PRECIO VENTA (L.) *"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Ej. 1800.00"
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                    required
                  />
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
                disabled={isSaving}
                style={{ backgroundColor: '#3730A3', borderRadius: '12px', padding: '12px 32px' }}
                icon={<CheckCircle2 size={18} />}
              >
                {isSaving ? 'Guardando...' : 'Guardar registro'}
              </Button>
            </div>

          </form>

        </Card>
      </div>
    </DashboardLayout>
  );
};
