import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Bell, BellOff, Flag } from 'lucide-react';
import type { ConfiguracionController } from '../useConfiguracion';

export const EstadosTab: React.FC<{ c: ConfiguracionController }> = ({ c }) => {
  const { estadosOrdenados, isSaving, crearEstado, actualizarColorEstado, alternarNotificacionEstado } = c;

  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#6366F1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const creado = await crearEstado(nombre, color);
    if (creado) setNombre('');
  };

  return (
    <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
          Estados del flujo de reparación
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
          Son las etapas que ves en el flujo operativo de cada orden. El orden lo define el número de secuencia.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#FAFAFD',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
        marginBottom: '24px'
      }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Nombre del estado"
            placeholder="Ej. Esperando repuesto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={50}
          />
        </div>
        <div className="input-group" style={{ width: '140px' }}>
          <label className="input-label">Color</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }}
            />
            <span style={{ fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase' }}>{color}</span>
          </div>
        </div>
        <Button variant="primary" type="submit" icon={<Plus size={16} />} disabled={isSaving}>
          Nuevo estado
        </Button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {estadosOrdenados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '14px' }}>
            Esta empresa no tiene estados configurados.
          </div>
        )}

        {estadosOrdenados.map((estado) => (
          <div key={estado.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#94A3B8', width: '24px' }}>{estado.orden}</span>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: estado.colorHex }} />
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>{estado.nombre}</span>
              {estado.estadoFinal && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#3730A3', backgroundColor: '#EDE9FE', padding: '2px 8px', borderRadius: '10px' }}>
                  <Flag size={11} /> FINAL
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => alternarNotificacionEstado(estado)}
                title={estado.notificarCliente ? 'Se notifica al cliente: clic para desactivar' : 'No se notifica al cliente: clic para activar'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: estado.notificarCliente ? '#DCFCE7' : '#F1F5F9',
                  color: estado.notificarCliente ? '#15803D' : '#64748B'
                }}
              >
                {estado.notificarCliente ? <Bell size={12} /> : <BellOff size={12} />}
                {estado.notificarCliente ? 'Notifica' : 'Sin aviso'}
              </button>

              <input
                type="color"
                value={estado.colorHex}
                onChange={(e) => actualizarColorEstado(estado, e.target.value)}
                title="Cambiar color"
                style={{ width: '32px', height: '32px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
