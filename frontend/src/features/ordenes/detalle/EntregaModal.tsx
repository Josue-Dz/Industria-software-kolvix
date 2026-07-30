import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Truck } from 'lucide-react';
import type { DetalleOrdenController } from './useDetalleOrden';

interface EntregaModalProps {
  d: DetalleOrdenController;
}

export const EntregaModal: React.FC<EntregaModalProps> = ({ d }) => {
  const {
    setIsEntregaModalOpen,
    entregaIdentidadVerificada, setEntregaIdentidadVerificada,
    entregaComprobante, setEntregaComprobante,
    entregaObservaciones, setEntregaObservaciones,
    handleRegistrarEntrega,
    isSaving,
  } = d;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }}>
      <Card style={{ backgroundColor: '#FFFFFF', padding: '32px', width: '480px', maxWidth: '90vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Truck size={22} color="#3730A3" />
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Registrar entrega del equipo
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
            <input
              type="checkbox"
              checked={entregaIdentidadVerificada}
              onChange={(e) => setEntregaIdentidadVerificada(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            Confirmo que verifiqué la identidad del cliente
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              URL de comprobante de entrega (opcional)
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="https://..."
              value={entregaComprobante}
              onChange={(e) => setEntregaComprobante(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              Observaciones (opcional)
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Ej: Cliente retiró el equipo en persona"
              value={entregaObservaciones}
              onChange={(e) => setEntregaObservaciones(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button type="button" variant="outline" onClick={() => setIsEntregaModalOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              style={{ backgroundColor: '#3730A3' }}
              disabled={isSaving || !entregaIdentidadVerificada}
              onClick={() => void handleRegistrarEntrega()}
            >
              {isSaving ? 'Guardando...' : 'Confirmar entrega'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};