import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Plus, Search, Eye, Edit3, Trash2 } from 'lucide-react';
import { authService } from '../../../api/services/authService';
import { ordenesService } from '../../../api/services/ordenesService';
import { TicketDrawer } from '../components/TicketDrawer';
import { mapOrderToTicket, type OrderTicket } from '../ordenTicket';
import type { EstadoReparacionResponse } from '../../../api/types';

export const OrdenesPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('Todos los estados');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDrawerTicket, setActiveDrawerTicket] = useState<OrderTicket | null>(null);
  const [statusOptions, setStatusOptions] = useState<EstadoReparacionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);

  const [orders, setOrders] = useState<OrderTicket[]>([
    {
      ticketId: 'KLX-2026-F89D',
      client: 'Nohely Reyes',
      phone: '+504 9931-2550',
      device: 'Iphone 13 Pro Max',
      serial: 'S/N:DNPGD703JQH',
      tech: 'L.Soto',
      status: 'Ingresado',
      total: 'L. 2,050',
      reportedDamage: 'El teléfono sufrió una caída vertical. Pantalla delantera completamente rota (vidrio fraccionado en la parte central), pero la placa base y FaceID responden al encendido.',
      diagBase: 'L. 350',
      partsCost: 'L. 1,400',
      laborCost: 'L. 300',
      evidenceNote1: 'Fractura crítica de vidrio.',
      evidenceNote2: 'Rayón menor previo.'
    },
    {
      ticketId: 'KLX-2026-A234',
      client: 'Ashley Silva',
      phone: '+504 9840-2151',
      device: 'MacBook Air M2',
      serial: 'S/N:C02YT451Q05D',
      tech: 'J.Pérez',
      status: 'Cotización',
      total: 'L. 1,600',
      reportedDamage: 'No enciende tras derrame accidental de café sobre el teclado. Teclas pegajosas.',
      diagBase: 'L. 350',
      partsCost: 'L. 1,000',
      laborCost: 'L. 250',
      evidenceNote1: 'Mancha de sulfatación en puerto USB-C.',
      evidenceNote2: 'Teclado obstruido.'
    },
    {
      ticketId: 'KLX-2026-N456',
      client: 'Ronny',
      phone: '+504 9931-2550',
      device: 'Samsung Galaxy S23',
      serial: 'S/N:DNPGD703JQH',
      tech: 'A.Rivas',
      status: 'En Reparación',
      total: 'L. 950',
      reportedDamage: 'Batería inflada y flex de carga suelto.',
      diagBase: 'L. 200',
      partsCost: 'L. 600',
      laborCost: 'L. 150',
      evidenceNote1: 'Tapa trasera desprendida por batería inflada.',
      evidenceNote2: 'Pin de carga sucio.'
    },
    {
      ticketId: 'KLX-2026-N457',
      client: 'José',
      phone: '+504 9840-2151',
      device: 'Iphone 13 Pro Max',
      serial: 'S/N:DNPGD703JQH',
      tech: 'L.Soto',
      status: 'Listo',
      total: 'L. 1,230',
      reportedDamage: 'Cambio preventivo de pantalla y auricular sin audio.',
      diagBase: 'L. 200',
      partsCost: 'L. 800',
      laborCost: 'L. 230',
      evidenceNote1: 'Malla de auricular obstruida.',
      evidenceNote2: 'Pantalla reemplazada.'
    }
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const cachedUser = authService.getCachedUser();
        const user = cachedUser ?? await authService.getCurrentUser();
        const [states, backendOrders] = await Promise.all([
          ordenesService.listarEstados(),
          ordenesService.listarTodas(user.empresaId),
        ]);

        if (!isMounted) {
          return;
        }

        setActiveCompanyId(user.empresaId);
        setStatusOptions(states);
        setOrders(backendOrders.map(mapOrderToTicket));
      } catch {
        if (isMounted) {
          setLoadError('No se pudieron cargar las ordenes desde el backend. Se muestran datos de ejemplo.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    const order = orders.find(o => o.ticketId === ticketId);
    const targetStatus = statusOptions.find(status => status.nombre === newStatus);

    setOrders(prev => prev.map(o => o.ticketId === ticketId ? {
      ...o,
      status: newStatus,
      stateId: targetStatus?.id ?? o.stateId,
    } : o));

    if (!order?.orderId || !activeCompanyId || !targetStatus) {
      return;
    }

    try {
      const updatedOrder = await ordenesService.cambiarEstado(activeCompanyId, order.orderId, {
        estadoNuevoId: targetStatus.id,
        comentario: `Estado actualizado desde frontend a ${targetStatus.nombre}`,
      });

      setOrders(prev => prev.map(o => o.ticketId === ticketId ? mapOrderToTicket(updatedOrder) : o));
    } catch {
      setLoadError('No se pudo actualizar el estado en el backend.');
    }
  };

  const handleDeleteOrder = (ticketId: string) => {
    if (window.confirm(`¿Está seguro de eliminar la orden ${ticketId}?`)) {
      setOrders(prev => prev.filter(o => o.ticketId !== ticketId));
      if (activeDrawerTicket?.ticketId === ticketId) {
        setActiveDrawerTicket(null);
      }
    }
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = ord.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ord.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ord.device.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'Todos los estados' || ord.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout
      title="Órdenes"
      subtitle=""
      role="admin"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', width: '100%' }}>
        
        {/* Top Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button style={{
            padding: '10px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            backgroundColor: '#EDE9FE',
            color: '#3730A3',
            border: 'none'
          }}>
            Lista de Órdenes
          </button>
          
          <Link to="/ordenes/nueva">
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: '#3730A3',
              border: 'none',
              cursor: 'pointer'
            }}>
              <Plus size={18} /> Registrar Nuevo Ingreso
            </button>
          </Link>
        </div>

        {isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando ordenes desde el backend...
          </Card>
        )}

        {loadError && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {loadError}
          </Card>
        )}

        {/* Search and Filter Box */}
        <Card hoverable={false} style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px', maxWidth: '500px' }}>
              <Input
                placeholder="Buscar cliente, ticket, modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                FILTRAR ESTADO :
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
                style={{ width: '200px', padding: '10px 14px' }}
              >
                <option>Todos los estados</option>
                {statusOptions.map(status => (
                  <option key={status.id} value={status.nombre}>{status.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Orders Table Wrapper con Overflow X Habilitado */}
        <Card hoverable={false} style={{ padding: 0, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', minWidth: '850px' }}>
              <thead>
                <tr style={{ backgroundColor: '#EDE9FE', color: '#3730A3', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '16px 20px', fontWeight: '800', whiteSpace: 'nowrap' }}>TICKET ID</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', whiteSpace: 'nowrap' }}>CLIENTE</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', whiteSpace: 'nowrap' }}>DISPOSITIVO</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', whiteSpace: 'nowrap' }}>TÉCNICO</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', whiteSpace: 'nowrap' }}>ESTADO ACTUAL</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', whiteSpace: 'nowrap' }}>MONTO TOTAL</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', textAlign: 'center', whiteSpace: 'nowrap' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.ticketId} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>
                      {ord.ticketId}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: '800', color: '#1E1B4B', display: 'block', whiteSpace: 'nowrap' }}>{ord.client}</span>
                      <span style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>{ord.phone}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: '700', color: '#1E293B', display: 'block', whiteSpace: 'nowrap' }}>{ord.device}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{ord.serial}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap' }}>
                      {ord.tech}
                    </td>
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                    <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.ticketId, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700',
                      backgroundColor:
                        ord.status === 'Ingresado' ? '#EDE9FE' :
                        ord.status === 'Cotización' ? '#E0E7FF' :
                        ord.status === 'En Reparación' ? '#CBD5E1' :
                        ord.status === 'Listo' ? '#DCFCE7' : '#F1F5F9',
                      color:
                        ord.status === 'Ingresado' ? '#3730A3' :
                        ord.status === 'Cotización' ? '#4338CA' :
                        ord.status === 'En Reparación' ? '#1E293B' :
                        ord.status === 'Listo' ? '#15803D' : '#475569',
                      border: 'none',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {statusOptions.length > 0 ? (
                      statusOptions.map((status) => (
                        <option key={status.id} value={status.nombre}>
                          • {status.nombre}
                        </option>
                      ))
                    ) : (
                      /* Fallback si el backend no ha respondido */
                      <>
                        <option value="Ingresado">• Ingresado</option>
                        <option value="Cotización">• Cotización</option>
                        <option value="En Reparación">• En Reparación</option>
                        <option value="Listo">• Listo</option>
                        <option value="Entregado">• Entregado</option>
                        <option value="Cerrado">• Cerrado</option>
                      </>
                    )}
                  </select>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1E1B4B', whiteSpace: 'nowrap' }}>
                      {ord.total}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', whiteSpace: 'nowrap', minWidth: '130px' }}>
                      <div style={{ display: 'inline-flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Pencil Icon */}
                        <button
                          onClick={() => setActiveDrawerTicket(ord)}
                          style={{ color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                          title="Ver Detalles Generales (Lápiz)"
                        >
                          <Edit3 size={18} />
                        </button>

                        {ord.orderId ? (
                          <Link to={`/ordenes/detalle/${ord.orderId}`} style={{ color: '#6366F1', display: 'inline-flex' }} title="Ver Cotización y Flujo">
                            <Eye size={18} />
                          </Link>
                        ) : (
                          <span style={{ color: '#CBD5E1', display: 'inline-flex' }} title="Orden de ejemplo sin detalle">
                            <Eye size={18} />
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(ord.ticketId)}
                          style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                          title="Eliminar Orden"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* RIGHT SLIDING DRAWER */}
        {activeDrawerTicket && (
          <TicketDrawer
            ticket={activeDrawerTicket}
            onClose={() => setActiveDrawerTicket(null)}
            onMarcarListo={() => {
              handleStatusChange(activeDrawerTicket.ticketId, 'Listo');
              setActiveDrawerTicket(null);
            }}
          />
        )}

      </div>
    </DashboardLayout>
  );
};