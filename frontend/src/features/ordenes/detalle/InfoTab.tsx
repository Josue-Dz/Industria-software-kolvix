import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatMoney, ESTADO_COTIZACION_LABEL } from './shared';
import type { DetalleOrdenController } from './useDetalleOrden';
import type { OrdenTrabajoResponse } from '../../../api/types';

interface InfoTabProps {
  d: DetalleOrdenController;
  orden: OrdenTrabajoResponse;
}

export const InfoTab: React.FC<InfoTabProps> = ({ d, orden }) => {
  const { cotizacionActual, siguienteEstado, isSaving, handleAvanzarEstado } = d;

  return (
    <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
        Detalles Generales del Ticket
      </h3>

      <div className="grid-2">
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>CLIENTE</span>
          <strong style={{ fontSize: '15px', color: '#1E1B4B' }}>{orden.nombreCliente}</strong>
          <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>Seguimiento: {orden.codigoSeguimiento}</span>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>DISPOSITIVO</span>
          <strong style={{ fontSize: '15px', color: '#1E1B4B' }}>{orden.dispositivoResumen || 'Sin detalle'}</strong>
          <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>ID dispositivo: {orden.idDispositivo}</span>
        </div>
      </div>

      <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>DAÑO REPORTADO</span>
        <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: 0 }}>
          "{orden.problemaReportado}"
        </p>
      </div>

      {orden.observaciones && (
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>OBSERVACIONES</span>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{orden.observaciones}</p>
        </div>
      )}

      <div>
        <span style={{ fontSize: '13px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
          Estructura de precios:
        </span>
        {cotizacionActual ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Costo de Repuestos:</span>
              <strong style={{ color: '#1E1B4B' }}>{formatMoney(cotizacionActual.montoRepuestos)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Costo de mano de Obra / Reparación:</span>
              <strong style={{ color: '#1E1B4B' }}>{formatMoney(cotizacionActual.montoManoObra)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#3730A3', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
              <span>Monto total ({ESTADO_COTIZACION_LABEL[cotizacionActual.estado] ?? cotizacionActual.estado}):</span>
              <span>{formatMoney(cotizacionActual.montoTotal)}</span>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            Aún no hay cotización para esta orden. Genera el diagnóstico y la cotización en sus pestañas.
          </p>
        )}
      </div>

      {siguienteEstado && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <Button variant="primary" style={{ backgroundColor: '#3730A3' }} disabled={isSaving} onClick={handleAvanzarEstado}>
            Avanzar a: {siguienteEstado.nombre}
          </Button>
        </div>
      )}
    </Card>
  );
};
