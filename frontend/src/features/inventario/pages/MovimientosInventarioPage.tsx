import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

export const MovimientosInventarioPage: React.FC = () => {
  const history = [
    { type: 'Entrada', qty: '+10', item: 'Pantalla OLED iPhone 13 Pro', reason: 'Compra Proveedor AppleParts', date: '20/07/2026 10:15 A.M', user: 'Admin' },
    { type: 'Salida', qty: '-1', item: 'Pantalla OLED iPhone 13 Pro', reason: 'Consumo Orden #ORD-2026-089', date: '20/07/2026 11:30 A.M', user: 'Mario Gómez' },
    { type: 'Salida', qty: '-1', item: 'Batería Samsung S22 Ultra', reason: 'Consumo Orden #ORD-2026-085', date: '19/07/2026 04:20 P.M', user: 'Roberto Silva' },
    { type: 'Entrada', qty: '+50', item: 'Centro de Carga Type-C', reason: 'Reabastecimiento General', date: '18/07/2026 09:00 A.M', user: 'Admin' }
  ];

  return (
    <DashboardLayout
      title="Movimientos de Inventario"
      subtitle="Kardex de entradas y salidas de repuestos en el taller."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Control Bar with Back to Inventory Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/inventario">
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Volver a Catálogo de Inventario
            </Button>
          </Link>

          <Link to="/inventario">
            <Button variant="primary" style={{ backgroundColor: '#3730A3' }} icon={<Package size={18} />}>
              Ver Repuestos
            </Button>
          </Link>
        </div>

        <Card hoverable={false} style={{ padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#EDE9FE', color: '#3730A3', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', fontWeight: '800' }}>TIPO</th>
                <th style={{ padding: '16px 24px', fontWeight: '800' }}>CANTIDAD</th>
                <th style={{ padding: '16px 24px', fontWeight: '800' }}>REPUESTO</th>
                <th style={{ padding: '16px 24px', fontWeight: '800' }}>MOTIVO / CONCEPTO</th>
                <th style={{ padding: '16px 24px', fontWeight: '800' }}>FECHA</th>
                <th style={{ padding: '16px 24px', fontWeight: '800' }}>REGISTRADO POR</th>
              </tr>
            </thead>
            <tbody>
              {history.map((mov, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: mov.type === 'Entrada' ? '#DCFCE7' : '#FEE2E2',
                      color: mov.type === 'Entrada' ? '#15803D' : '#B91C1C'
                    }}>
                      {mov.type === 'Entrada' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                      {mov.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: '800', color: mov.type === 'Entrada' ? '#15803D' : '#B91C1C' }}>
                    {mov.qty}
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1E1B4B' }}>{mov.item}</td>
                  <td style={{ padding: '16px 24px', color: '#475569' }}>{mov.reason}</td>
                  <td style={{ padding: '16px 24px', color: '#64748B' }}>{mov.date}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '600', color: '#3730A3' }}>{mov.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

      </div>
    </DashboardLayout>
  );
};
