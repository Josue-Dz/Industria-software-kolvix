import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Search, AlertTriangle } from 'lucide-react';

export const InventarioDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [repuestos, setRepuestos] = useState([
    {
      code: 'PRT-9821',
      title: 'Pantalla OLED Premium iPhone 13 Pro Max',
      compatibility: 'Apple iPhone 13 Pro Max',
      cost: 'L. 1,400',
      stock: 4,
      stockUnit: 'unidades',
      isCritical: false
    },
    {
      code: 'PRT-8866',
      title: 'Puerto de Carga Tipo C Dual Directo',
      compatibility: 'Huawei,Moto,Xiaomi,Samnsung',
      cost: 'L. 120',
      stock: 4,
      stockUnit: 'unidades',
      isCritical: false
    },
    {
      code: 'PRT-8801',
      title: 'Bateria Alta Densidad iPad Air 5',
      compatibility: 'iPad Air 4/ iPad Air 5',
      cost: 'L. 800',
      stock: 1,
      stockUnit: 'unidad',
      isCritical: true
    },
    {
      code: 'PRT-1192',
      title: 'Pasta Térmica Grizzly Kryonaut 1g',
      compatibility: 'Consolas de videojuegos,laptops,PCs',
      cost: 'L. 350',
      stock: 4,
      stockUnit: 'unidades',
      isCritical: false
    },
    {
      code: 'PRT-5512',
      title: 'Módulo Joystick Efecto Hall Switch',
      compatibility: 'Nintendo Joy-Con',
      cost: 'L. 150',
      stock: 4,
      stockUnit: 'unidades',
      isCritical: false
    },
    {
      code: 'PRT-2495',
      title: 'Pantalla OLED Premium iPhone 14 Pro Max',
      compatibility: 'Apple iPhone 14 Pro Max',
      cost: 'L. 1500',
      stock: 4,
      stockUnit: 'unidades',
      isCritical: false
    }
  ]);

  const handleReabastecer = (code: string) => {
    setRepuestos(prev => prev.map(item => item.code === code ? { ...item, stock: item.stock + 5, isCritical: false } : item));
  };

  const handleRemover = (code: string) => {
    setRepuestos(prev => prev.filter(item => item.code !== code));
  };

  const filteredRepuestos = repuestos.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.compatibility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Inventario"
      subtitle=""
      role="admin"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Actions Bar matching INVENTARIO DASHBOARD.png */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <Link to="/inventario/movimientos">
            <button style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              backgroundColor: '#EDE9FE',
              color: '#3730A3',
              border: 'none',
              cursor: 'pointer'
            }}>
              Movimientos
            </button>
          </Link>

          <Link to="/inventario/nuevo">
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              backgroundColor: '#EDE9FE',
              color: '#3730A3',
              border: 'none',
              cursor: 'pointer'
            }}>
              <Plus size={18} /> Registrar Nuevo Repuesto
            </button>
          </Link>
        </div>

        {/* Search Bar matching INVENTARIO DASHBOARD.png */}
        <Card hoverable={false} style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
          <Input
            placeholder="Buscar repuesto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
            style={{ border: 'none', boxShadow: 'none', fontSize: '15px' }}
          />
        </Card>

        {/* Repuestos Cards Grid (3 per row) matching INVENTARIO DASHBOARD.png */}
        <div className="grid-3">
          {filteredRepuestos.map((item) => (
            <Card
              key={item.code}
              hoverable={false}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '260px'
              }}
            >
              <div>
                {/* Badges Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#64748B',
                    backgroundColor: '#F1F5F9',
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}>
                    {item.code}
                  </span>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#3730A3',
                    backgroundColor: '#EDE9FE',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    STOCK: {item.stock} {item.stockUnit}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px', lineHeight: 1.3 }}>
                  {item.title}
                </h3>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', marginBottom: '16px' }}>
                  <p style={{ color: '#475569' }}>
                    <strong style={{ color: '#1E1B4B' }}>Compatibilidad:</strong> {item.compatibility}
                  </p>
                  <p style={{ color: '#475569' }}>
                    <strong style={{ color: '#1E1B4B' }}>Costo unitario:</strong> {item.cost}
                  </p>
                </div>

                {/* Critical Stock Alert Banner */}
                {item.isCritical && (
                  <div style={{
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '16px'
                  }}>
                    <AlertTriangle size={16} /> ¡Stock crítico! Solicitar suministro inmediato
                  </div>
                )}
              </div>

              {/* Bottom Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => handleReabastecer(item.code)}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    backgroundColor: '#EDE9FE',
                    color: '#3730A3',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Reabastecer +5
                </button>

                <button
                  onClick={() => handleRemover(item.code)}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backgroundColor: '#FFFFFF',
                    color: '#64748B',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  Remover
                </button>
              </div>

            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};
