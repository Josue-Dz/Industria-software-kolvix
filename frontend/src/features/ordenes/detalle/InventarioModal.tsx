import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Search, Package, X } from 'lucide-react';
import { formatMoney } from './shared';
import type { DetalleOrdenController } from './useDetalleOrden';

export const InventarioModal: React.FC<{ d: DetalleOrdenController }> = ({ d }) => {
  const {
    isSaving, filteredInventory,
    setIsInventoryModalOpen, inventorySearch, setInventorySearch,
    selectedPart, setSelectedPart, partQty, setPartQty,
    manualName, setManualName, manualPrice, setManualPrice, manualQty, setManualQty,
    handleAgregarRepuestoInventario, handleAgregarRepuestoManual,
  } = d;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <Card hoverable={false} style={{ width: '100%', maxWidth: '580px', padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Inventario del Taller
            </h3>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              Selecciona un repuesto para asignarlo a la orden
            </span>
          </div>
          <button
            onClick={() => { setIsInventoryModalOpen(false); setSelectedPart(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <Input
          placeholder="Buscar por nombre, código o marca..."
          value={inventorySearch}
          onChange={(e) => setInventorySearch(e.target.value)}
          icon={<Search size={18} />}
        />

        {/* Parts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPart(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: selectedPart?.id === item.id ? '2px solid #3730A3' : '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="card-hover"
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Package size={20} />
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                  {item.nombre}
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {item.codigo ?? 'Sin código'} · {item.stockActual} disponibles · <strong style={{ color: '#3730A3' }}>{formatMoney(item.precioVenta)}</strong>
                </span>
              </div>
            </div>
          ))}

          {filteredInventory.length === 0 && (
            <span style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '12px' }}>
              No hay repuestos en el inventario (puedes agregarlo manualmente abajo).
            </span>
          )}
        </div>

        {selectedPart && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <Input
              label="CANTIDAD"
              type="number"
              min={1}
              value={partQty}
              onChange={(e) => setPartQty(e.target.value)}
              style={{ width: '120px' }}
            />
            <Button variant="primary" size="sm" style={{ backgroundColor: '#3730A3' }} disabled={isSaving} onClick={handleAgregarRepuestoInventario}>
              Agregar
            </Button>
          </div>
        )}

        {/* Entrada manual */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
            ¿No está en inventario? Agrégalo manualmente
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
            <Input
              placeholder="Nombre del repuesto"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              maxLength={100}
            />
            <Input
              placeholder="Precio"
              type="number"
              min={0}
              step="0.01"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
            />
            <Input
              placeholder="Cant."
              type="number"
              min={1}
              value={manualQty}
              onChange={(e) => setManualQty(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" disabled={isSaving} onClick={handleAgregarRepuestoManual}>
            Agregar repuesto manual
          </Button>
        </div>

      </Card>
    </div>
  );
};
