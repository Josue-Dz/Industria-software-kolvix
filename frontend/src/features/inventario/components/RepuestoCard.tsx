import React from 'react';
import { Card } from '../../../components/ui/Card';
import { AlertTriangle } from 'lucide-react';
import { formatoLempiras } from '../../../utils/formato';
import type { RepuestoResponse } from '../../../api/types';

interface RepuestoCardProps {
  repuesto: RepuestoResponse;
  onReabastecer: (repuesto: RepuestoResponse) => void;
  onDesactivar: (repuesto: RepuestoResponse) => void;
}

export const RepuestoCard: React.FC<RepuestoCardProps> = ({ repuesto, onReabastecer, onDesactivar }) => (
  <Card
    hoverable={false}
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '260px'
    }}
  >
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#64748B',
          backgroundColor: '#F1F5F9',
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          {repuesto.codigo ?? `REP-${repuesto.id}`}
        </span>

        <span style={{
          fontSize: '12px',
          fontWeight: '700',
          color: '#3730A3',
          backgroundColor: '#EDE9FE',
          padding: '4px 12px',
          borderRadius: '12px'
        }}>
          STOCK: {repuesto.stockActual} {repuesto.stockActual === 1 ? 'unidad' : 'unidades'}
        </span>
      </div>

      <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px', lineHeight: 1.3 }}>
        {repuesto.nombre}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', marginBottom: '16px' }}>
        <p style={{ color: '#475569' }}>
          <strong style={{ color: '#1E1B4B' }}>Marca:</strong> {repuesto.marca ?? 'Sin marca'}
        </p>
        <p style={{ color: '#475569' }}>
          <strong style={{ color: '#1E1B4B' }}>Costo unitario:</strong> {formatoLempiras(repuesto.precioCosto)}
        </p>
        <p style={{ color: '#475569' }}>
          <strong style={{ color: '#1E1B4B' }}>Precio venta:</strong> {formatoLempiras(repuesto.precioVenta)}
        </p>
      </div>

      {repuesto.stockBajo && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          borderRadius: '10px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginBottom: '16px'
        }}>
          <AlertTriangle size={16} /> ¡Stock crítico! Solicitar suministro inmediato
        </div>
      )}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
      <button
        onClick={() => onReabastecer(repuesto)}
        style={{
          padding: '10px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '700',
          backgroundColor: '#EDE9FE',
          color: '#3730A3',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Reabastecer
      </button>

      <button
        onClick={() => onDesactivar(repuesto)}
        style={{
          padding: '10px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '600',
          backgroundColor: '#FFFFFF',
          color: '#64748B',
          border: '1px solid #E2E8F0',
          cursor: 'pointer'
        }}
      >
        Desactivar
      </button>
    </div>
  </Card>
);
