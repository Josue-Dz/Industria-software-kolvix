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
import { useDashboardTaller } from '../hooks/useDashboardTaller';
import { formatoFechaHora } from '../../../utils/formato';
import type { CodigoEstadoReparacion, OrdenTrabajoResponse } from '../../../api/types';

const esDeHoy = (iso: string | null): boolean => {
  if (!iso) return false;
  const fecha = new Date(iso);
  const hoy = new Date();
  return fecha.toDateString() === hoy.toDateString();
};

export const DashboardTallerPage: React.FC = () => {
  const { ordenes, estados, repuestos, isLoading, error } = useDashboardTaller();

  const nombreEstadoDe = (orden: OrdenTrabajoResponse): string =>
    orden.nombreEstado || estados.find((e) => e.id === orden.idEstado)?.nombre || 'Sin estado';

  const contarPorEstado = (codigo: CodigoEstadoReparacion): number =>
    ordenes.filter((o) => o.codigoEstado === codigo).length;

  const kpiCards = [
    { label: 'Órdenes recibidas hoy', count: ordenes.filter((o) => esDeHoy(o.fechaIngreso)).length, icon: Inbox },
    { label: 'Diagnósticos pendientes', count: contarPorEstado('DIAGNOSTICO'), icon: Stethoscope },
    { label: 'Cotizaciones pendientes', count: contarPorEstado('COTIZACION'), icon: FileSpreadsheet },
    { label: 'Reparaciones activas', count: contarPorEstado('EN_REPARACION'), icon: Wrench },
    { label: 'Control de calidad', count: contarPorEstado('CONTROL_CALIDAD'), icon: ShieldCheck },
    { label: 'Listo para entrega', count: contarPorEstado('LISTO_ENTREGA'), icon: PackageCheck }
  ];

  const ordenesRecientes = [...ordenes]
    .sort((a, b) => new Date(b.fechaIngreso ?? 0).getTime() - new Date(a.fechaIngreso ?? 0).getTime());

  const actividadReciente = ordenesRecientes.slice(0, 5);

  const proximasEntregas = ordenes
    .filter((o) => o.codigoEstado === 'LISTO_ENTREGA')
    .slice(0, 4);

  const alertasInventario = repuestos.filter((r) => r.stockBajo && r.activo).slice(0, 5);

  const colorEstadoDe = (orden: OrdenTrabajoResponse): string =>
    orden.colorHexEstado || estados.find((e) => e.id === orden.idEstado)?.colorHex || '#3730A3';

  return (
    <DashboardLayout title="Dashboard" subtitle="">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando información del taller...
          </Card>
        )}

        {error && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {error}
          </Card>
        )}

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

        {/* Middle Section with 3 Equal Columns */}
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
                {actividadReciente.map((orden) => (
                  <div key={orden.idOrden} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colorEstadoDe(orden),
                      marginTop: '6px',
                      flexShrink: 0
                    }} />
                    <div>
                      <p style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.4, margin: 0 }}>
                        <strong>{orden.numeroOrden}</strong> {orden.nombreCliente} · {nombreEstadoDe(orden)}
                      </p>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Ingreso: {formatoFechaHora(orden.fechaIngreso)}
                      </span>
                    </div>
                  </div>
                ))}
                {!isLoading && actividadReciente.length === 0 && (
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Aún no hay órdenes registradas.</span>
                )}
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
                {proximasEntregas.map((orden) => (
                  <Link key={orden.idOrden} to={`/ordenes/detalle/${orden.idOrden}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      backgroundColor: '#FFFFFF'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#3730A3', display: 'block' }}>
                        {orden.numeroOrden}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', display: 'block' }}>
                        {orden.nombreCliente}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        {orden.dispositivoResumen || 'Sin detalle del dispositivo'}
                      </span>
                    </div>
                  </Link>
                ))}
                {!isLoading && proximasEntregas.length === 0 && (
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>No hay órdenes listas para entrega.</span>
                )}
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
                {alertasInventario.map((rep) => (
                  <div key={rep.id} style={{
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
                        {rep.nombre}
                      </span>
                      <span style={{ fontSize: '11px', color: '#B91C1C' }}>
                        Restantes: {rep.stockActual} {rep.stockActual === 1 ? 'unidad' : 'unidades'} (mínimo {rep.stockMinimo})
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
                {!isLoading && alertasInventario.length === 0 && (
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Sin alertas: todo el inventario está sobre el mínimo.</span>
                )}
              </div>

              <Link to="/inventario">
                <Button variant="outline" style={{ width: '100%', borderRadius: '12px', fontSize: '13px' }}>
                  Gestionar Inventario
                </Button>
              </Link>
            </div>

          </div>
        </Card>

        {/* Bottom Section: Últimas órdenes registradas */}
        <Card hoverable={false} style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '20px' }}>
            Últimas órdenes registradas
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ordenesRecientes.slice(0, 5).map((orden) => (
              <div key={orden.idOrden} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderRadius: '14px',
                border: '1px solid #F1F5F9',
                backgroundColor: '#FAFAFD'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3', width: '110px' }}>
                    {orden.numeroOrden}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B', width: '160px' }}>
                    {orden.nombreCliente}
                  </span>
                  <span style={{ fontSize: '14px', color: '#64748B', flex: 1 }}>
                    {orden.dispositivoResumen || 'Sin detalle del dispositivo'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    backgroundColor: '#F1F5F9',
                    color: colorEstadoDe(orden)
                  }}>
                    • {nombreEstadoDe(orden)}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748B', width: '150px' }}>
                    Técnico: {orden.nombreTecnico ?? 'Sin asignar'}
                  </span>
                  <Link to={`/ordenes/detalle/${orden.idOrden}`} style={{ color: '#94A3B8' }}>
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
            {!isLoading && ordenes.length === 0 && (
              <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                Aún no hay órdenes registradas. Crea la primera desde el módulo de Órdenes.
              </span>
            )}
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};
