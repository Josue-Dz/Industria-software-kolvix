import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { ArrowLeft, User, Wrench, Calendar } from 'lucide-react';
import { formatDate } from './shared';
import type { OrdenTrabajoResponse } from '../../../api/types';

export const OrdenHeaderCard: React.FC<{ orden: OrdenTrabajoResponse }> = ({ orden }) => (
  <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>{orden.numeroOrden}</span>
          <span className="badge badge-purple" style={{ backgroundColor: '#EDE9FE', color: orden.colorHexEstado ?? '#3730A3' }}>
            • {orden.nombreEstado}
          </span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#3730A3', marginBottom: '12px' }}>
          {orden.dispositivoResumen || 'Dispositivo sin detalle'}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} color="#6366F1" /> <span>{orden.nombreCliente}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wrench size={16} color="#6366F1" /> <span>{orden.nombreTecnico ?? 'Sin asignar'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="#6366F1" /> <span>Ingreso: {formatDate(orden.fechaIngreso)}</span>
          </div>
        </div>
      </div>

      <Link to="/ordenes" style={{ color: '#3730A3' }}>
        <ArrowLeft size={24} />
      </Link>
    </div>
  </Card>
);
