import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Wrench} from 'lucide-react';
import { authService } from '../../../api/services/authService';
import { tecnicosService } from '../../../api/services/tecnicosService';
import { ordenesService } from '../../../api/services/ordenesService';
import type { OrdenTrabajoResponse } from '../../../api/types';
import { normalizarTexto as normalizar } from '../../../utils/formato';

const esDeHoy = (iso: string | null): boolean => {
  if (!iso) return false;
  const fecha = new Date(iso);
  const hoy = new Date();
  return fecha.toDateString() === hoy.toDateString();
};

export const DashboardTecnicoPage: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenTrabajoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        
        const perfil = await authService.getCurrentUser();
        const tecnico = await tecnicosService.obtenerMiPerfil();
        const misOrdenes = await ordenesService.listarPorEmpresaYTecnico(perfil.empresaId, tecnico.idTecnico);
        if (!ignore) setOrdenes(misOrdenes);
      } catch {
        // 2. Omitida la variable 'err' sin usar
        if (!ignore) setError('No se pudieron cargar tus órdenes asignadas.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    cargar();
    return () => { ignore = true; };
  }, []);

  const asignadasHoy = ordenes.filter((o) => esDeHoy(o.fechaIngreso)).length;
  const enProceso = ordenes.filter((o) => normalizar(o.nombreEstado ?? '').includes('reparacion')).length;
  const completadasHoy = ordenes.filter((o) => o.fechaEntrega && esDeHoy(o.fechaEntrega)).length;

  return (
    <DashboardLayout
      title="Mis Órdenes Asignadas"
      subtitle="Visualiza y actualiza los trabajos técnicos asignados a tu usuario."
      role="tecnico"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {error && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {error}
          </Card>
        )}

        <div className="grid-3">
          <Card style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #6366F1' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Asignadas Hoy</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginTop: '4px' }}>
              {asignadasHoy}
            </span>
          </Card>
          <Card style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #F59E0B' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>En Proceso de Reparación</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginTop: '4px' }}>
              {enProceso}
            </span>
          </Card>
          <Card style={{ backgroundColor: '#FFFFFF', borderLeft: '4px solid #10B981' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Completadas Hoy</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginTop: '4px' }}>
              {completadasHoy}
            </span>
          </Card>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B' }}>
          Lista de Trabajos Asignados
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>Cargando órdenes...</span>
          ) : ordenes.length === 0 ? (
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>No tienes órdenes asignadas por el momento.</span>
          ) : (
            ordenes.map((orden) => (
              <Card key={orden.idOrden} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EDE9FE', color: '#3730A3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wrench size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B' }}>{orden.numeroOrden}</span>
                      <span className="badge" style={{ backgroundColor: orden.colorHexEstado ?? '#94A3B8', color: '#FFFFFF' }}>
                        {orden.nombreEstado ?? 'Sin estado'}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#475569' }}>
                      {orden.dispositivoResumen} — <strong style={{ color: '#1E1B4B' }}>{orden.problemaReportado}</strong>
                    </p>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      Cliente: {orden.nombreCliente} • Ingreso: {new Date(orden.fechaIngreso).toLocaleString('es-HN')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/ordenes/detalle/${orden.idOrden}`}>
                    <Button variant="outline" size="sm" icon={<Wrench size={16} />}>
                      Ver detalle
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};