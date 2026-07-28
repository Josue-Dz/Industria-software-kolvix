import React from 'react';
import { Link } from 'react-router-dom';
import { X, Camera } from 'lucide-react';
import type { OrderTicket } from '../ordenTicket';

interface TicketDrawerProps {
  ticket: OrderTicket;
  onClose: () => void;
  onMarcarListo: () => void;
}

// Drawer lateral derecho con los detalles generales del ticket.
export const TicketDrawer: React.FC<TicketDrawerProps> = ({ ticket, onClose, onMarcarListo }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end'
  }}>
    <div style={{
      width: '460px',
      height: '100%',
      backgroundColor: '#FFFFFF',
      boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
      padding: '32px 24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: '800',
              color: '#3730A3',
              backgroundColor: '#EDE9FE',
              padding: '4px 12px',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              {ticket.ticketId}
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Detalles Generales del Ticket
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={24} />
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', marginBottom: '20px' }} />

        {/* Cliente and Dispositivo Grid */}
        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>CLIENTE</span>
            <strong style={{ fontSize: '14px', color: '#1E1B4B' }}>{ticket.client}</strong>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>{ticket.phone}</span>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>DISPOSITIVO</span>
            <strong style={{ fontSize: '14px', color: '#1E1B4B' }}>{ticket.device}</strong>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>{ticket.serial}</span>
          </div>
        </div>

        {/* Daño Reportado Box */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
            DAÑO REPORTADO
          </span>
          <div style={{ backgroundColor: '#EDE9FE', padding: '14px', borderRadius: '12px', color: '#3730A3', fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{ticket.reportedDamage}"
          </div>
        </div>

        {/* Observaciones */}
        {ticket.observaciones && (
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
              OBSERVACIONES
            </span>
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#475569', fontSize: '13px', lineHeight: 1.5 }}>
              {ticket.observaciones}
            </div>
          </div>
        )}

        {/* Datos de la orden */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
            DATOS DE LA ORDEN
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estado actual:</span>
              <strong style={{ color: ticket.statusColor }}>{ticket.status}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Técnico asignado:</span>
              <strong style={{ color: '#1E1B4B' }}>{ticket.tech}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Fecha de ingreso:</span>
              <strong style={{ color: '#1E1B4B' }}>
                {ticket.fechaIngreso ? new Date(ticket.fechaIngreso).toLocaleDateString('es-HN') : '—'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800', color: '#3730A3', borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '4px' }}>
              <span>Estado de pago:</span>
              <span>{ticket.total}</span>
            </div>
          </div>
        </div>

        {/* El desglose económico y la evidencia fotográfica viven en el detalle de la orden. */}
        {ticket.orderId && (
          <Link
            to={`/ordenes/detalle/${ticket.orderId}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#3730A3' }}
          >
            <Camera size={16} /> Ver diagnóstico, cotización y evidencia
          </Link>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
        <button
          onClick={onClose}
          style={{
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            backgroundColor: '#FFFFFF',
            color: '#3730A3',
            border: '1.5px solid #3730A3',
            cursor: 'pointer'
          }}
        >
          Salir de detalle
        </button>

        <button
          onClick={onMarcarListo}
          style={{
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            backgroundColor: '#3730A3',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Listo para entregar
        </button>
      </div>

    </div>
  </div>
);
