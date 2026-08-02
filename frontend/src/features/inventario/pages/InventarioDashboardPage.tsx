import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Plus, Search } from 'lucide-react';
import { useRepuestos } from '../hooks/useRepuestos';
import { RepuestoCard } from '../components/RepuestoCard';
import { MovimientoFormDrawer } from '../components/MovimientoFormDrawer';
import { getApiErrorMessage } from '../../../api/apiError';
import type { RepuestoResponse } from '../../../api/types';

export const InventarioDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { repuestos, isLoading, error, setError, cargar, desactivar } = useRepuestos();
  const [repuestoAReabastecer, setRepuestoAReabastecer] = useState<RepuestoResponse | null>(null);

  const handleDesactivar = async (repuesto: RepuestoResponse) => {
    if (!window.confirm(`¿Desactivar el repuesto "${repuesto.nombre}"? Dejará de aparecer en el catálogo.`)) {
      return;
    }
    try {
      await desactivar(repuesto);
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo desactivar el repuesto.'));
    }
  };

  const filteredRepuestos = repuestos.filter(rep => {
    const term = searchTerm.toLowerCase();
    return rep.nombre.toLowerCase().includes(term) ||
           (rep.codigo ?? '').toLowerCase().includes(term) ||
           (rep.marca ?? '').toLowerCase().includes(term);
  });

  return (
    <DashboardLayout title="Inventario" subtitle="">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Top Actions Bar */}
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

        {isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando repuestos desde el backend...
          </Card>
        )}

        {error && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {error}
          </Card>
        )}

        {/* Search Bar */}
        <Card hoverable={false} style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
          <Input
            placeholder="Buscar repuesto por nombre, código o marca"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
            style={{ border: 'none', boxShadow: 'none', fontSize: '15px' }}
          />
        </Card>

        {!isLoading && filteredRepuestos.length === 0 && (
          <Card hoverable={false} style={{ padding: '32px', borderRadius: '16px', textAlign: 'center', color: '#64748B', fontWeight: '600' }}>
            No hay repuestos activos. Usa "Registrar Nuevo Repuesto" para agregar el primero.
          </Card>
        )}

        {/* Repuestos Cards Grid */}
        <div className="grid-3">
          {filteredRepuestos.map((repuesto) => (
            <RepuestoCard
              key={repuesto.id}
              repuesto={repuesto}
              onReabastecer={setRepuestoAReabastecer}
              onDesactivar={handleDesactivar}
            />
          ))}
        </div>

        {repuestoAReabastecer && (
          <MovimientoFormDrawer
            repuestos={repuestos}
            repuestoInicialId={repuestoAReabastecer.id}
            tipoInicial="ENTRADA"
            onClose={() => setRepuestoAReabastecer(null)}
            onRegistrado={() => cargar()}
          />
        )}

      </div>
    </DashboardLayout>
  );
};
