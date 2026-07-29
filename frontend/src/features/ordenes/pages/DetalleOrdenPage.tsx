import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Info, Stethoscope, FileText, Camera } from 'lucide-react';
import { useDetalleOrden } from '../detalle/useDetalleOrden';
import { OrdenHeaderCard } from '../detalle/OrdenHeaderCard';
import { InfoTab } from '../detalle/InfoTab';
import { DiagnosticoTab } from '../detalle/DiagnosticoTab';
import { CotizacionTab } from '../detalle/CotizacionTab';
import { EvidenciaTab } from '../detalle/EvidenciaTab';
import { FlujoOperativoCard } from '../detalle/FlujoOperativoCard';
import { InventarioModal } from '../detalle/InventarioModal';
import type { SubTab } from '../detalle/shared';
import { EntregaModal } from '../detalle/EntregaModal';

export const DetalleOrdenPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const d = useDetalleOrden(Number(id));
  const { orden, activeSubTab, setActiveSubTab } = d;

  const tabButton = (tab: SubTab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveSubTab(tab)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '700',
        backgroundColor: activeSubTab === tab ? '#EDE9FE' : 'transparent',
        color: activeSubTab === tab ? '#3730A3' : '#64748B',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <DashboardLayout title="Órdenes" subtitle="">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>

        {d.isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando detalle de la orden...
          </Card>
        )}

        {d.loadError && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {d.loadError}
          </Card>
        )}

        {orden && (
          <>
            <OrdenHeaderCard orden={orden} />

            {/* Sub Navigation Bar */}
            <Card hoverable={false} style={{ padding: '8px 16px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {tabButton('info', <Info size={18} />, 'Información')}
                {tabButton('diag', <Stethoscope size={18} />, 'Diagnóstico')}
                {/* La cotización es comercial: el técnico ve solo si fue
                    aprobada, desde la pestaña Información. */}
                {!d.esTecnico && tabButton('cot', <FileText size={18} />, 'Cotización')}
                {tabButton('evi', <Camera size={18} />, 'Evidencia')}
              </div>
            </Card>

            {d.actionError && (
              <Card hoverable={false} style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '600', fontSize: '13px' }}>
                {d.actionError}
              </Card>
            )}
            {d.actionOk && (
              <Card hoverable={false} style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#166534', fontWeight: '600', fontSize: '13px' }}>
                {d.actionOk}
              </Card>
            )}

            {/* Main Content Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '24px' }}>

              {/* Left Dynamic Tab Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeSubTab === 'info' && <InfoTab d={d} orden={orden} />}
                {activeSubTab === 'diag' && <DiagnosticoTab d={d} orden={orden} />}
                {activeSubTab === 'cot' && !d.esTecnico && <CotizacionTab d={d} orden={orden} />}
                {activeSubTab === 'evi' && <EvidenciaTab d={d} />}
              </div>

              {/* Right Column: Flujo Operativo Timeline */}
              <FlujoOperativoCard d={d} orden={orden} />

            </div>
          </>
        )}

        {/* MODAL: Inventario del Taller */}
        {d.isInventoryModalOpen && d.diagnostico && <InventarioModal d={d} />}
        {d.isEntregaModalOpen && <EntregaModal d={d} />}

      </div>
    </DashboardLayout>
  );
};
