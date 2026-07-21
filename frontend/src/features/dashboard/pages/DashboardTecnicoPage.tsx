import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Wrench, Camera, CheckCircle, Clock } from 'lucide-react';

export const DashboardTecnicoPage: React.FC = () => {
  return (
    <DashboardLayout
      title="Mis Órdenes Asignadas"
      subtitle="Visualiza y actualiza los trabajos técnicos asignados a tu usuario."
      role="tecnico"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Metric Cards Top */}
        <div className="grid-3">
          <Card style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #6366F1' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Asignadas Hoy</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginTop: '4px' }}>8</span>
          </Card>
          <Card style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #F59E0B' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>En Proceso de Reparación</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginTop: '4px' }}>3</span>
          </Card>
          <Card style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #10B981' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Completadas Hoy</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginTop: '4px' }}>5</span>
          </Card>
        </div>

        {/* Assigned Orders List */}
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B' }}>
          Lista de Trabajos Asignados
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Work Item 1 */}
          <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EDE9FE', color: '#3730A3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wrench size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B' }}>ORD-2026-089</span>
                  <span className="badge badge-warning">En Proceso</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569' }}>
                  iPhone 13 Pro — <strong style={{ color: '#1E1B4B' }}>Cambio de pantalla y batería</strong>
                </p>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Cliente: Carlos Mendoza • Ingreso: Hoy 9:30 A.M</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/ordenes/diagnostico">
                <Button variant="outline" size="sm" icon={<Wrench size={16} />}>
                  Diagnóstico
                </Button>
              </Link>
              <Link to="/ordenes/evidencia">
                <Button variant="primary" size="sm" style={{ backgroundColor: '#3730A3' }} icon={<Camera size={16} />}>
                  Subir Evidencia
                </Button>
              </Link>
            </div>
          </Card>

          {/* Work Item 2 */}
          <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EDE9FE', color: '#3730A3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wrench size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B' }}>ORD-2026-087</span>
                  <span className="badge badge-purple">Pendiente Diagnóstico</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569' }}>
                  Samsung S22 Ultra — <strong style={{ color: '#1E1B4B' }}>Revisión de centro de carga</strong>
                </p>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Cliente: Luis Rodríguez • Ingreso: Hoy 11:00 A.M</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/ordenes/diagnostico">
                <Button variant="accent" size="sm" icon={<Wrench size={16} />}>
                  Diagnosticar
                </Button>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};
