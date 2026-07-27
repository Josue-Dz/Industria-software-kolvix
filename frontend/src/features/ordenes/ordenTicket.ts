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
  total: string;
  reportedDamage: string;
  diagBase: string;
  partsCost: string;
  laborCost: string;
  evidenceNote1: string;
  evidenceNote2: string;
}

export const mapOrderToTicket = (order: OrdenTrabajoResponse): OrderTicket => ({
  orderId: order.idOrden,
  companyId: order.idEmpresa,
  stateId: order.idEstado,
  ticketId: order.numeroOrden || order.codigoSeguimiento || `ORD-${order.idOrden}`,
  client: order.nombreCliente || 'Cliente sin nombre',
  phone: order.codigoSeguimiento ? `Seguimiento: ${order.codigoSeguimiento}` : 'Telefono no disponible',
  device: order.dispositivoResumen || 'Dispositivo sin detalle',
  serial: `ID dispositivo: ${order.idDispositivo}`,
  tech: order.nombreTecnico || 'Sin asignar',
  status: order.nombreEstado || 'Sin estado',
  total: order.estadoPAgo ? `Pago: ${order.estadoPAgo}` : 'Pendiente',
  reportedDamage: order.problemaReportado || order.observaciones || 'Sin problema reportado',
  diagBase: '-',
  partsCost: '-',
  laborCost: '-',
  evidenceNote1: order.observaciones || 'Sin observaciones',
  evidenceNote2: order.fechaIngreso
    ? `Ingreso: ${new Date(order.fechaIngreso).toLocaleDateString()}`
    : 'Sin fecha de ingreso',
});
