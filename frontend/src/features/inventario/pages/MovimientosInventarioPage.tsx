import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, RefreshCcw, Plus } from 'lucide-react';
import { useMovimientos } from '../hooks/useMovimientos';
import { useRepuestos } from '../hooks/useRepuestos';
import { MovimientoFormDrawer } from '../components/MovimientoFormDrawer';
import { formatoFechaHora } from '../../../utils/formato';
import type { MovimientoInventarioResponse, TipoMovimientoInventario } from '../../../api/types';

const ESTILO_TIPO: Record<TipoMovimientoInventario, { fondo: string; color: string; signo: string }> = {
  ENTRADA: { fondo: '#DCFCE7', color: '#15803D', signo: '+' },
  DEVOLUCION: { fondo: '#DCFCE7', color: '#15803D', signo: '+' },
  SALIDA: { fondo: '#FEE2E2', color: '#B91C1C', signo: '-' },
  AJUSTE: { fondo: '#E0E7FF', color: '#4338CA', signo: '=' },
};

const iconoTipo = (tipo: TipoMovimientoInventario) =>
  tipo === 'SALIDA' ? <ArrowUpRight size={14} /> :
  tipo === 'AJUSTE' ? <RefreshCcw size={14} /> :
  <ArrowDownRight size={14} />;

export const MovimientosInventarioPage: React.FC = () => {
  const { movimientos, isLoading, error, agregarMovimiento } = useMovimientos();
  const { repuestos, cargar: recargarRepuestos } = useRepuestos();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRegistrado = (movimiento: MovimientoInventarioResponse) => {
    agregarMovimiento(movimiento);
    recargarRepuestos();
  };

  return (
    <DashboardLayout
      title="Movimientos de Inventario"
      subtitle="Kardex de entradas y salidas de repuestos en el taller."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/inventario">
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Volver a Catálogo de Inventario
            </Button>
          </Link>

          <Button
            variant="primary"
            style={{ backgroundColor: '#3730A3' }}
            icon={<Plus size={18} />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Registrar Movimiento
          </Button>
        </div>

        {isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando movimientos desde el backend...
          </Card>
        )}

        {error && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {error}
          </Card>
        )}

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
              {movimientos.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px 24px', textAlign: 'center', color: '#64748B', fontWeight: '600' }}>
                    Aún no hay movimientos registrados. Usa "Registrar Movimiento" para crear el primero.
                  </td>
                </tr>
              )}
              {movimientos.map((mov) => {
                const estilo = ESTILO_TIPO[mov.tipoMovimiento];
                return (
                  <tr key={mov.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: estilo.fondo,
                        color: estilo.color
                      }}>
                        {iconoTipo(mov.tipoMovimiento)}
                        {mov.tipoMovimiento}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '800', color: estilo.color }}>
                      {estilo.signo}{mov.cantidad}
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1E1B4B' }}>{mov.repuestoNombre}</td>
                    <td style={{ padding: '16px 24px', color: '#475569' }}>
                      {mov.observacion ?? (mov.ordenId ? `Consumo Orden #${mov.ordenId}` : 'Sin observación')}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#64748B' }}>{formatoFechaHora(mov.fechaMovimiento)}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: '#3730A3' }}>
                      {mov.usuarioNombre ?? 'Sistema'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {isDrawerOpen && (
          <MovimientoFormDrawer
            repuestos={repuestos}
            onClose={() => setIsDrawerOpen(false)}
            onRegistrado={handleRegistrado}
          />
        )}

      </div>
    </DashboardLayout>
  );
};
