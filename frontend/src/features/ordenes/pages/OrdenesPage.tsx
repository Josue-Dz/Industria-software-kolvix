import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Plus, Search, Eye, Edit3, Trash2, X, Camera } from 'lucide-react';

interface OrderTicket {
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

export const OrdenesPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('Todos los estados');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDrawerTicket, setActiveDrawerTicket] = useState<OrderTicket | null>(null);

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

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.ticketId === ticketId ? { ...o, status: newStatus } : o));
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
        
        {/* Top Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        {/* Search and Filter Box */}
        <Card hoverable={false} style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, maxWidth: '500px' }}>
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
                <option>Ingresado</option>
                <option>Cotización</option>
                <option>En Reparación</option>
                <option>Listo</option>
                <option>Entregado</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Orders Table matching ESTADOS DE LA ORDENES.png */}
        <Card hoverable={false} style={{ padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#EDE9FE', color: '#3730A3', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>TICKET ID</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>CLIENTE</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>DISPOSITIVO</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>TÉCNICO</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>ESTADO ACTUAL</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>MONTO TOTAL</th>
                <th style={{ padding: '16px 20px', fontWeight: '800', textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.ticketId} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                  <td style={{ padding: '16px 20px', fontWeight: '700', color: '#475569' }}>
                    {ord.ticketId}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontWeight: '800', color: '#1E1B4B', display: 'block' }}>{ord.client}</span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{ord.phone}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontWeight: '700', color: '#1E293B', display: 'block' }}>{ord.device}</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{ord.serial}</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: '600', color: '#475569' }}>
                    {ord.tech}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.ticketId, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        backgroundColor: ord.status === 'Ingresado' ? '#EDE9FE' :
                                         ord.status === 'Cotización' ? '#E0E7FF' :
                                         ord.status === 'En Reparación' ? '#CBD5E1' :
                                         ord.status === 'Listo' ? '#DCFCE7' : '#F1F5F9',
                        color: ord.status === 'Ingresado' ? '#3730A3' :
                               ord.status === 'Cotización' ? '#4338CA' :
                               ord.status === 'En Reparación' ? '#1E293B' :
                               ord.status === 'Listo' ? '#15803D' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Ingresado">• Ingresado</option>
                      <option value="Cotización">• Cotización</option>
                      <option value="En Reparación">• En Reparación</option>
                      <option value="Listo">• Listo</option>
                      <option value="Entregado">• Entregado</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1E1B4B' }}>
                    {ord.total}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '12px', alignItems: 'center' }}>
                      {/* Pencil Icon opens exact Detalles Generales del Ticket Drawer */}
                      <button
                        onClick={() => setActiveDrawerTicket(ord)}
                        style={{ color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        title="Ver Detalles Generales (Lápiz)"
                      >
                        <Edit3 size={18} />
                      </button>

                      <Link to="/ordenes/detalle" style={{ color: '#6366F1' }} title="Ver Cotización y Flujo">
                        <Eye size={18} />
                      </Link>

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
        </Card>

        {/* RIGHT SLIDING DRAWER matching Detalles generales de la orden.png 100% */}
        {activeDrawerTicket && (
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
                      {activeDrawerTicket.ticketId}
                    </span>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Detalles Generales del Ticket
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => setActiveDrawerTicket(null)}
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
                    <strong style={{ fontSize: '14px', color: '#1E1B4B' }}>{activeDrawerTicket.client}</strong>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>{activeDrawerTicket.phone}</span>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>DISPOSITIVO</span>
                    <strong style={{ fontSize: '14px', color: '#1E1B4B' }}>{activeDrawerTicket.device}</strong>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>{activeDrawerTicket.serial}</span>
                  </div>
                </div>

                {/* Daño Reportado Box */}
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
                    DAÑO REPORTADO
                  </span>
                  <div style={{ backgroundColor: '#EDE9FE', padding: '14px', borderRadius: '12px', color: '#3730A3', fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{activeDrawerTicket.reportedDamage}"
                  </div>
                </div>

                {/* Evidencia y Desgaste Físico Registrado */}
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
                    EVIDENCIA Y DESGASTE FÍSICO REGISTRADO
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      height: '180px',
                      borderRadius: '12px',
                      backgroundColor: '#EDE9FE',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: '#3730A3'
                    }}>
                      <Camera size={32} />
                      <span style={{ fontSize: '12px', fontWeight: '700' }}>Evidencia del Equipo</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                      <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                        <span style={{ color: '#94A3B8', fontSize: '11px', display: 'block' }}>(50 %, 45%)</span>
                        <strong style={{ color: '#1E1B4B' }}>{activeDrawerTicket.evidenceNote1}</strong>
                      </div>

                      <div>
                        <span style={{ color: '#94A3B8', fontSize: '11px', display: 'block' }}>(20 %, 78%)</span>
                        <strong style={{ color: '#1E1B4B' }}>{activeDrawerTicket.evidenceNote2}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estructura de precios */}
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
                    Estructura de precios:
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Precio Diagnostico Base:</span>
                      <strong style={{ color: '#1E1B4B' }}>{activeDrawerTicket.diagBase}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Costo de Repuestos Consumidos:</span>
                      <strong style={{ color: '#1E1B4B' }}>{activeDrawerTicket.partsCost}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Costo de mano de Obra / Reparación:</span>
                      <strong style={{ color: '#1E1B4B' }}>{activeDrawerTicket.laborCost}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800', color: '#3730A3', borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '4px' }}>
                      <span>Monto total a liquidar (con cotización aprobada):</span>
                      <span>{activeDrawerTicket.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons matching Detalles generales de la orden.png */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setActiveDrawerTicket(null)}
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
                  onClick={() => {
                    handleStatusChange(activeDrawerTicket.ticketId, 'Listo');
                    setActiveDrawerTicket(null);
                  }}
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
        )}

      </div>
    </DashboardLayout>
  );
};
