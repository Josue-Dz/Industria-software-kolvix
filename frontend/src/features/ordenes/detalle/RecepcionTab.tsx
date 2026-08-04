import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ChasisInteractivo } from './ChasisInteractivo';
import { useRecepcion } from './useRecepcion';
import { formatDate } from './shared';
import type { EstadoFisicoGeneral, OrdenTrabajoResponse } from '../../../api/types';

const ESTADOS_FISICOS: { valor: EstadoFisicoGeneral; label: string }[] = [
  { valor: 'BUENO', label: 'Bueno' },
  { valor: 'REGULAR', label: 'Regular' },
  { valor: 'DANIADO', label: 'Dañado' },
  { valor: 'NO_APLICA', label: 'No aplica' },
];

interface RecepcionTabProps {
  orden: OrdenTrabajoResponse;
  soloLectura: boolean;
}

export const RecepcionTab: React.FC<RecepcionTabProps> = ({ orden, soloLectura }) => {
  const r = useRecepcion(orden, soloLectura);

  if (r.isLoading) {
    return (
      <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
        <span style={{ fontSize: '14px', color: '#64748B' }}>Cargando recepción…</span>
      </Card>
    );
  }

  return (
    <Card
      hoverable={false}
      style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
          Recepción del equipo
        </h3>
        <span style={{ fontSize: '13px', color: '#6366F1', fontWeight: '600' }}>
          {orden.numeroOrden} · {orden.nombreCliente} · {orden.dispositivoResumen}
        </span>
      </div>

      {soloLectura && (
        <div style={{ backgroundColor: '#F1F5F9', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
          Estás viendo el estado en que el equipo entró al taller. La recepción la registra el personal de mostrador.
        </div>
      )}

      {r.error && (
        <div style={{ backgroundColor: '#FEF2F2', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#B91C1C', fontWeight: '600' }}>
          {r.error}
        </div>
      )}

      {r.mensajeOk && (
        <div style={{ backgroundColor: '#ECFDF5', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#047857', fontWeight: '600' }}>
          {r.mensajeOk}
        </div>
      )}

      {!r.checklist && soloLectura && (
        <div style={{ backgroundColor: '#FFFBEB', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#92400E', fontWeight: '600' }}>
          Esta orden todavía no tiene checklist de recepción.
        </div>
      )}

      <div className="recepcion-grid" style={{ display: 'grid', gap: '20px' }}>
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '14px' }}>
            Estado físico al ingresar
          </span>

          <ChasisInteractivo
            categoriaId={r.categoriaId}
            vistas={r.vistas}
            danos={r.danos}
            onChange={r.setDanos}
            readOnly={soloLectura}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {r.plantillas.length > 0 && (
            <div className="input-group">
              <label className="input-label">Plantilla de inspección</label>
              <select
                className="input-field"
                value={r.plantillaId}
                onChange={(e) => r.setPlantillaId(e.target.value)}
                disabled={soloLectura}
              >
                <option value="">Vistas genéricas</option>
                {r.plantillas.map((plantilla) => (
                  <option key={plantilla.id} value={plantilla.id}>
                    {plantilla.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Estado general</label>
            <select
              className="input-field"
              value={r.estadoFisico}
              onChange={(e) => r.setEstadoFisico(e.target.value as EstadoFisicoGeneral | '')}
              disabled={soloLectura}
            >
              <option value="">Sin evaluar</option>
              {ESTADOS_FISICOS.map(({ valor, label }) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Observaciones</label>
            <textarea
              className="input-field"
              rows={4}
              maxLength={500}
              value={r.observaciones}
              onChange={(e) => r.setObservaciones(e.target.value)}
              disabled={soloLectura}
              placeholder="Accesorios recibidos, condiciones acordadas con el cliente…"
              style={{ resize: 'vertical' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
            <input
              type="checkbox"
              checked={r.aceptacionCliente}
              onChange={(e) => r.setAceptacionCliente(e.target.checked)}
              disabled={soloLectura}
            />
            El cliente aceptó el estado descrito
          </label>

          {r.checklist && (
            <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>
              Registrada por {r.checklist.usuarioNombre ?? '—'} el {formatDate(r.checklist.fecha)}
              {r.checklist.fechaAceptacion && (
                <>
                  <br />
                  Aceptada por el cliente el {formatDate(r.checklist.fechaAceptacion)}
                </>
              )}
            </div>
          )}

          {!soloLectura && (
            <Button onClick={r.guardar} disabled={r.isSaving} style={{ alignSelf: 'flex-start' }}>
              {r.isSaving ? 'Guardando…' : r.checklist ? 'Guardar cambios' : 'Registrar recepción'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
