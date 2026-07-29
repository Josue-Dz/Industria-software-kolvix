import React from 'react';
import { CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import type { EstadoCotizacion } from '../../../api/types';

interface Aviso {
  titulo: string;
  detalle: string;
  color: string;
  fondo: string;
  borde: string;
  icono: React.ReactNode;
}

// Qué significa cada estado de la cotización para el técnico, en términos de su
// trabajo: la única pregunta que necesita responder es si ya puede reparar.
const AVISO_POR_ESTADO: Record<EstadoCotizacion, Aviso> = {
  APROBADA: {
    titulo: 'Cotización aprobada',
    detalle: 'El cliente autorizó la reparación. Puedes iniciar el trabajo.',
    color: '#166534',
    fondo: '#F0FDF4',
    borde: '#BBF7D0',
    icono: <CheckCircle size={20} color="#16A34A" />,
  },
  ENVIADA: {
    titulo: 'Esperando respuesta del cliente',
    detalle: 'La cotización ya se envió. No inicies la reparación hasta que sea aprobada.',
    color: '#92400E',
    fondo: '#FFFBEB',
    borde: '#FDE68A',
    icono: <Clock size={20} color="#D97706" />,
  },
  PENDIENTE: {
    titulo: 'Cotización en preparación',
    detalle: 'Recepción aún está armando la cotización con tu diagnóstico.',
    color: '#3730A3',
    fondo: '#EEF2FF',
    borde: '#C7D2FE',
    icono: <FileText size={20} color="#6366F1" />,
  },
  RECHAZADA: {
    titulo: 'Cotización rechazada',
    detalle: 'El cliente no autorizó la reparación. No continúes con el trabajo.',
    color: '#991B1B',
    fondo: '#FEF2F2',
    borde: '#FECACA',
    icono: <XCircle size={20} color="#DC2626" />,
  },
  VENCIDA: {
    titulo: 'Cotización vencida',
    detalle: 'La cotización perdió vigencia. Consulta con recepción antes de continuar.',
    color: '#92400E',
    fondo: '#FFFBEB',
    borde: '#FDE68A',
    icono: <Clock size={20} color="#D97706" />,
  },
  CANCELADA: {
    titulo: 'Cotización cancelada',
    detalle: 'La cotización fue cancelada. No continúes con el trabajo.',
    color: '#991B1B',
    fondo: '#FEF2F2',
    borde: '#FECACA',
    icono: <XCircle size={20} color="#DC2626" />,
  },
};

const SIN_COTIZACION: Aviso = {
  titulo: 'Sin cotización todavía',
  detalle: 'Registra tu diagnóstico para que recepción pueda cotizar la reparación.',
  color: '#475569',
  fondo: '#F8FAFC',
  borde: '#E2E8F0',
  icono: <FileText size={20} color="#94A3B8" />,
};

// Aviso para el técnico: le dice si está autorizado a reparar, sin exponerle
// montos ni acciones comerciales.
export const AutorizacionReparacion: React.FC<{ estado: EstadoCotizacion | null }> = ({ estado }) => {
  const aviso = estado ? AVISO_POR_ESTADO[estado] ?? SIN_COTIZACION : SIN_COTIZACION;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      backgroundColor: aviso.fondo,
      border: `1px solid ${aviso.borde}`,
      borderRadius: '12px',
      padding: '16px',
    }}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>{aviso.icono}</span>
      <div>
        <span style={{ fontSize: '14px', fontWeight: '800', color: aviso.color, display: 'block' }}>
          {aviso.titulo}
        </span>
        <span style={{ fontSize: '13px', color: aviso.color, opacity: 0.9 }}>
          {aviso.detalle}
        </span>
      </div>
    </div>
  );
};
