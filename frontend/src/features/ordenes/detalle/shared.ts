// Helpers compartidos por las vistas del detalle de orden.

export type SubTab = 'info' | 'rec' | 'diag' | 'cot' | 'evi';

export const formatMoney = (monto: number | null | undefined): string =>
  monto === null || monto === undefined ? '—' : `L. ${Number(monto).toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

export const formatDate = (fecha: string | null | undefined): string =>
  fecha ? new Date(fecha).toLocaleDateString('es-HN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

export const ESTADO_COTIZACION_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente (borrador)',
  ENVIADA: 'Enviada al cliente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  VENCIDA: 'Vencida',
  CANCELADA: 'Cancelada',
};
