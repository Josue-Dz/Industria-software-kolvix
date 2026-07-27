import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import type { DetalleOrdenController } from './useDetalleOrden';
import type { OrdenTrabajoResponse } from '../../../api/types';

interface FlujoOperativoCardProps {
  d: DetalleOrdenController;
  orden: OrdenTrabajoResponse;
}

export const FlujoOperativoCard: React.FC<FlujoOperativoCardProps> = ({ d, orden }) => {
  const { estadosOrdenados, estadoActualIdx, isSaving, handleSeleccionarEstado, handleInicializarEstados } = d;

  return (
    <Card hoverable={false} style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF', alignSelf: 'start' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
        Flujo Operativo
      </h3>
      <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', margin: '4px 0 24px 0' }}>
        Haz clic en una etapa para mover la orden a ese estado.
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
        {estadosOrdenados.map((estado, idx) => {
          const completado = estadoActualIdx >= 0 && idx < estadoActualIdx;
          const activo = estado.id === orden.idEstado;
          return (
            <div
              key={estado.id}
              onClick={() => void handleSeleccionarEstado(estado)}
              title={activo ? 'Estado actual' : `Mover la orden a "${estado.nombre}"`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                opacity: completado || activo ? 1 : 0.5,
                cursor: activo ? 'default' : 'pointer'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: activo ? '#1E1B4B' : completado ? '#A78BFA' : '#EDE9FE',
                color: activo || completado ? '#FFFFFF' : '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                flexShrink: 0
              }}>
                {completado ? <CheckCircle size={20} /> : idx + 1}
              </div>
              <span style={{
                fontSize: '15px',
                fontWeight: activo ? '800' : '700',
                color: activo ? '#1E1B4B' : completado ? '#3730A3' : '#64748B'
              }}>
                {estado.nombre}
              </span>
            </div>
          );
        })}

        {estadosOrdenados.length === 0 && (
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>No se pudieron cargar los estados.</span>
        )}

        {estadosOrdenados.length > 0 && estadosOrdenados.length < 4 && (
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#92400E', fontWeight: '600' }}>
              Tu empresa tiene un flujo incompleto: faltan las etapas estándar del proceso de reparación.
            </span>
            <Button variant="outline" size="sm" disabled={isSaving} onClick={handleInicializarEstados}>
              Completar flujo estándar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
