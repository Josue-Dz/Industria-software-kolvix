import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { movimientosInventarioService } from '../../../api/services/movimientosInventarioService';
import { getApiErrorMessage } from '../../../api/apiError';
import type {
  MovimientoInventarioResponse,
  RepuestoResponse,
  TipoMovimientoInventario,
} from '../../../api/types';

const TIPOS: { valor: TipoMovimientoInventario; etiqueta: string }[] = [
  { valor: 'ENTRADA', etiqueta: 'Entrada (compra / reabastecimiento)' },
  { valor: 'SALIDA', etiqueta: 'Salida (consumo en reparación)' },
  { valor: 'DEVOLUCION', etiqueta: 'Devolución (regresa al inventario)' },
  { valor: 'AJUSTE', etiqueta: 'Ajuste (fijar stock exacto)' },
];

interface MovimientoFormDrawerProps {
  repuestos: RepuestoResponse[];
  repuestoInicialId?: number;
  tipoInicial?: TipoMovimientoInventario;
  onClose: () => void;
  onRegistrado: (movimiento: MovimientoInventarioResponse) => void;
}

export const MovimientoFormDrawer: React.FC<MovimientoFormDrawerProps> = ({
  repuestos,
  repuestoInicialId,
  tipoInicial = 'ENTRADA',
  onClose,
  onRegistrado,
}) => {
  const [repuestoId, setRepuestoId] = useState<string>(repuestoInicialId ? String(repuestoInicialId) : '');
  const [tipo, setTipo] = useState<TipoMovimientoInventario>(tipoInicial);
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [observacion, setObservacion] = useState('');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const repuestoSeleccionado = repuestos.find(r => String(r.id) === repuestoId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setIsSaving(true);

    try {
      const movimiento = await movimientosInventarioService.registrar({
        repuestoId: Number(repuestoId),
        tipoMovimiento: tipo,
        cantidad: Number(cantidad),
        precioUnitario: Number(precioUnitario || 0),
        observacion: observacion.trim() || undefined,
      });
      onRegistrado(movimiento);
      onClose();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'No se pudo registrar el movimiento.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '420px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
          padding: '32px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: '800',
              color: '#3730A3',
              backgroundColor: '#EDE9FE',
              padding: '4px 12px',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              KARDEX
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Registrar Movimiento
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
              El stock del repuesto se actualiza automáticamente.
            </p>
          </div>

          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={24} />
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: 0 }} />

        {formError && (
          <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700', fontSize: '13px' }}>
            {formError}
          </div>
        )}

        <div className="input-group">
          <label className="input-label">TIPO DE MOVIMIENTO *</label>
          <select
            className="input-field"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoMovimientoInventario)}
            required
          >
            {TIPOS.map(opcion => (
              <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">REPUESTO *</label>
          <select
            className="input-field"
            value={repuestoId}
            onChange={(e) => setRepuestoId(e.target.value)}
            required
          >
            <option value="" disabled>Seleccione un repuesto</option>
            {repuestos.map(rep => (
              <option key={rep.id} value={rep.id}>
                {rep.nombre} (stock: {rep.stockActual})
              </option>
            ))}
          </select>
        </div>

        <Input
          label={tipo === 'AJUSTE' ? 'STOCK FINAL *' : 'CANTIDAD *'}
          type="number"
          min={tipo === 'AJUSTE' ? 0 : 1}
          placeholder={tipo === 'AJUSTE' ? 'Stock exacto resultante' : 'Unidades del movimiento'}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />

        <Input
          label="PRECIO UNITARIO (L.)"
          type="number"
          min={0}
          step="0.01"
          placeholder={repuestoSeleccionado ? `Sugerido: ${repuestoSeleccionado.precioCosto}` : '0.00'}
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
        />

        <div className="input-group">
          <label className="input-label">OBSERVACIÓN</label>
          <textarea
            className="input-field"
            rows={3}
            maxLength={255}
            placeholder="Ej. Compra a proveedor, consumo de orden, conteo físico..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              backgroundColor: '#FFFFFF',
              color: '#3730A3',
              border: '1.5px solid #3730A3',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: '12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              backgroundColor: isSaving ? '#A5B4FC' : '#3730A3',
              color: '#FFFFFF',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};
