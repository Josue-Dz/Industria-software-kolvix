import type { OrdenTrabajoResponse } from '../../api/types';

// Modelo de presentación que usan la tabla de órdenes y su drawer de detalles.
export interface OrderTicket {
  orderId?: number;
  companyId?: number;
  stateId?: number;
  ticketId: string;
  client: string;
  phone: string;
  device: string;
  serial: string;
  tech: string;
  status: string;
  statusColor: string;
  total: string;
  reportedDamage: string;
  observaciones: string;
  fechaIngreso: string;
}

export const mapOrderToTicket = (order: OrdenTrabajoResponse): OrderTicket => ({
  orderId: order.idOrden,
  companyId: order.idEmpresa,
  stateId: order.idEstado,
  ticketId: order.numeroOrden || order.codigoSeguimiento || `ORD-${order.idOrden}`,
  client: order.nombreCliente || 'Cliente sin nombre',
  phone: order.codigoSeguimiento ? `Seguimiento: ${order.codigoSeguimiento}` : 'Sin código de seguimiento',
  device: order.dispositivoResumen || 'Dispositivo sin detalle',
  serial: `ID dispositivo: ${order.idDispositivo}`,
  tech: order.nombreTecnico || 'Sin asignar',
  status: order.nombreEstado || 'Sin estado',
  statusColor: order.colorHexEstado || '#3730A3',
  total: order.estadoPAgo ? `Pago: ${order.estadoPAgo}` : 'Pendiente',
  reportedDamage: order.problemaReportado || 'Sin problema reportado',
  observaciones: order.observaciones || '',
  fechaIngreso: order.fechaIngreso,
});
