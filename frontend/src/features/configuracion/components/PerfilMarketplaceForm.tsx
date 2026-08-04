import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { EmpresaResponse, PerfilMarketplace, PerfilMarketplaceRequest } from '../../../api/types';

interface PerfilMarketplaceFormProps {
  empresa: EmpresaResponse | null;
  perfil: PerfilMarketplace | null;
  isSaving: boolean;
  onGuardar: (datos: PerfilMarketplaceRequest) => Promise<boolean>;
}

export const PerfilMarketplaceForm: React.FC<PerfilMarketplaceFormProps> = ({
  empresa, perfil, isSaving, onGuardar,
}) => {
  const [descripcion, setDescripcion] = useState(perfil?.descripcionPublica ?? '');
  const [horario, setHorario] = useState(perfil?.horarioAtencion ?? '');
  const [latitud, setLatitud] = useState(perfil?.latitud != null ? String(perfil.latitud) : '');
  const [longitud, setLongitud] = useState(perfil?.longitud != null ? String(perfil.longitud) : '');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onGuardar({
      descripcionPublica: descripcion.trim() || undefined,
      horarioAtencion: horario.trim() || undefined,
      latitud: latitud.trim() === '' ? null : Number(latitud),
      longitud: longitud.trim() === '' ? null : Number(longitud),
      marketplaceVisible: perfil?.marketplaceVisible ?? false,
    });
  };

  return (
    <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
        Perfil público del taller
      </h3>
      <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 24px 0' }}>
        Esto es lo que ven los clientes en el marketplace. El nombre, teléfono, correo y dirección
        se toman de la pestaña Empresa.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {empresa && (
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>{empresa.nombre}</span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              {empresa.direccion || 'Sin dirección registrada'}
            </span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              {empresa.telefono || 'Sin teléfono'} · {empresa.correo}
            </span>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Descripción pública</label>
          <textarea
            className="input-field"
            rows={4}
            placeholder="Cuenta a los clientes qué repara tu taller, tu experiencia y qué te diferencia."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <Input
          label="Horario de atención"
          placeholder="Ej. Lunes a viernes 8:00 - 17:00, sábados 8:00 - 12:00"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          maxLength={255}
        />

        <div>
          <div className="grid-2">
            <Input
              label="Latitud"
              type="number"
              step="0.0000001"
              placeholder="Ej. 14.0723"
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
            />
            <Input
              label="Longitud"
              type="number"
              step="0.0000001"
              placeholder="Ej. -87.1921"
              value={longitud}
              onChange={(e) => setLongitud(e.target.value)}
            />
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', margin: '6px 0 0 0' }}>
            Las coordenadas permiten que tu taller aparezca en la búsqueda por cercanía. Puedes
            obtenerlas en Google Maps con clic derecho sobre tu ubicación.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Guardando...' : perfil ? 'Guardar cambios' : 'Crear perfil público'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
