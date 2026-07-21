import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  Inbox, 
  Stethoscope, 
  FileSpreadsheet, 
  Wrench, 
  ShieldCheck, 
  PackageCheck,
  AlertTriangle,
  ChevronRight,
  Clock
} from 'lucide-react';

export const DashboardTallerPage: React.FC = () => {
  const kpiCards = [
    { label: 'Órdenes recibidas hoy', count: 2, icon: Inbox },
    { label: 'Diagnósticos pendientes', count: 1, icon: Stethoscope },
    { label: 'Cotizaciones pendientes', count: 2, icon: FileSpreadsheet },
    { label: 'Reparaciones activas', count: 4, icon: Wrench },
    { label: 'Control de calidad', count: 1, icon: ShieldCheck },
    { label: 'Listo de entrega', count: 3, icon: PackageCheck }
  ];

  const recentActivity = [
    { action: 'Recepción', text: 'OR-2041 recibida Macbook Pro 14', time: 'hace 4 min', color: '#6366F1' },
    { action: 'Cliente', text: 'aprobó la cotización OR-2041', time: 'hace 4 min', color: '#10B981' },
    { action: 'L. Soto', text: 'completó diagnóstico OR-2039', time: 'hace 4 min', color: '#3730A3' },
    { action: 'Entrega', text: 'OR-2037 entregada a David', time: 'hace 2 horas', color: '#10B981' },
    { action: 'Asignación', text: 'OR-2038 asignada a A. Rivas', time: 'hace 4 min', color: '#F59E0B' }
  ];

  const upcomingDeliveries = [
    { code: 'OR-2038', client: 'Nohely Reyes', device: 'Iphone 13 Pro Max' },
    { code: 'OR-2039', client: 'José Daniel Nuñez', device: 'Iphone 13 Pro Max' },
    { code: 'OR-2040', client: 'Ashley Silva', device: 'Macbook Air M2' },
    { code: 'OR-2041', client: 'Ronny Díaz', device: 'Samsung Galaxy S23' }
  ];

  const inventoryAlerts = [
    { name: 'Batería Samsung Galaxy S21', detail: 'Restantes: 2 unidades' },
    { name: 'Pantalla Samsung Galaxy S23', detail: 'Restantes: 2 unidades' },
    { name: 'Centro de carga tipo C', detail: 'Restantes: 2 unidades' }
  ];

  const recentOrders = [
    { code: 'OR-2041', client: 'Ronny Díaz', device: 'Samsung Galaxy S23', status: 'Diagnóstico', tech: 'L. Soto', badgeBg: '#EDE9FE', badgeColor: '#3730A3' },
    { code: 'OR-2040', client: 'Ashley Silva', device: 'Macbook Air M2', status: 'Ingresado', tech: 'J. Pérez', badgeBg: '#E0E7FF', badgeColor: '#4338CA' },
    { code: 'OR-2039', client: 'José Daniel Nuñez', device: 'Iphone 13 Pro Max', status: 'En reparación', tech: 'A. Rivas', badgeBg: '#FEF3C7', badgeColor: '#D97706' },
    { code: 'OR-2038', client: 'Nohely Reyes', device: 'Iphone 13 Pro Max', status: 'Listo', tech: 'L. Soto', badgeBg: '#DCFCE7', badgeColor: '#15803D' },
    { code: 'OR-2037', client: 'David', device: 'Dell G15 5530', status: 'Entregado', tech: 'A. Rivas', badgeBg: '#F1F5F9', badgeColor: '#475569' }
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle=""
      role="admin"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top 6 KPI Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px'
        }}>
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Card key={idx} hoverable={false} style={{
                backgroundColor: '#FFFFFF',
                padding: '20px 16px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '110px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#EDE9FE',
                    color: '#3730A3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B' }}>{kpi.count}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', lineHeight: 1.2 }}>
                  {kpi.label}
                </span>
              </Card>
            );
          })}
        </div>

        {/* Middle Section with 3 Equal Columns inside Container */}
        <Card hoverable={false} style={{
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px'
          }}>
            
            {/* Column 1: Actividad reciente */}
            <div style={{ borderRight: '1px dashed #CBD5E1', paddingRight: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Clock size={18} color="#1E1B4B" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  Actividad reciente
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: act.color,
                      marginTop: '6px',
                      flexShrink: 0
                    }} />
                    <div>
                      <p style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.4 }}>
                        <strong>{act.action}</strong> {act.text}
                      </p>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Próximas entregas */}
            <div style={{ borderRight: '1px dashed #CBD5E1', paddingRight: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Clock size={18} color="#1E1B4B" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  Próximas entregas
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingDeliveries.map((item) => (
                  <div key={item.code} style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#FFFFFF'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#3730A3', display: 'block' }}>
                      {item.code}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', display: 'block' }}>
                      {item.client}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      {item.device}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Alertas de inventario */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <AlertTriangle size={18} color="#EF4444" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  Alertas de inventario
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {inventoryAlerts.map((inv, idx) => (
                  <div key={idx} style={{
                    border: '1px solid #FEE2E2',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#FEF2F2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#991B1B', display: 'block' }}>
                        {inv.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#B91C1C' }}>
                        {inv.detail}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#FEE2E2',
                      color: '#991B1B',
                      border: '1px solid #FCA5A5'
                    }}>
                      Stock bajo
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/inventario">
                <Button variant="outline" style={{ width: '100%', borderRadius: '12px', fontSize: '13px' }}>
                  Gestionar Inventario
                </Button>
              </Link>
            </div>

          </div>
        </Card>

        {/* Bottom Section: Últimas órdenes registradas Table */}
        <Card hoverable={false} style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '20px' }}>
            Últimas órdenes registradas
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentOrders.map((ord) => (
              <div key={ord.code} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderRadius: '14px',
                border: '1px solid #F1F5F9',
                backgroundColor: '#FAFAFD'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3', width: '90px' }}>
                    {ord.code}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B', width: '160px' }}>
                    {ord.client}
                  </span>
                  <span style={{ fontSize: '14px', color: '#64748B', flex: 1 }}>
                    {ord.device}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    backgroundColor: ord.badgeBg,
                    color: ord.badgeColor
                  }}>
                    • {ord.status}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748B', width: '130px' }}>
                    Técnico: {ord.tech}
                  </span>
                  <Link to="/ordenes/detalle" style={{ color: '#94A3B8' }}>
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};
