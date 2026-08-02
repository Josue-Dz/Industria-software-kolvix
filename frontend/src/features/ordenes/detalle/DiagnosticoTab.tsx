import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { formatMoney } from './shared';
import type { DetalleOrdenController } from './useDetalleOrden';
import type { ComplejidadDiagnostico, OrdenTrabajoResponse } from '../../../api/types';

interface DiagnosticoTabProps {
  d: DetalleOrdenController;
  orden: OrdenTrabajoResponse;
}

export const DiagnosticoTab: React.FC<DiagnosticoTabProps> = ({ d, orden }) => {
  const {
    diagnostico, diagnosticoBloqueado, cotizacionActual, tecnicos, isSaving, esTecnico,
    diagTecnicoId, setDiagTecnicoId, diagProblema, setDiagProblema, diagCausa, setDiagCausa,
    diagTiempo, setDiagTiempo, diagComplejidad, setDiagComplejidad, diagObs, setDiagObs,
    montoRepuestosDiagnostico, setIsInventoryModalOpen, setActiveSubTab,
    handleGuardarDiagnostico, handleEliminarRepuesto,
  } = d;

  return (
    <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
          Diagnóstico Técnico
        </h3>
        <span style={{ fontSize: '13px', color: '#6366F1', fontWeight: '600' }}>
          {orden.numeroOrden} · {orden.nombreCliente} · {orden.dispositivoResumen}
        </span>
      </div>

      {diagnosticoBloqueado && (
        <div style={{ backgroundColor: '#FFFBEB', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#92400E', fontWeight: '600' }}>
          {cotizacionActual?.estado === 'ENVIADA'
            ? 'La cotización está enviada al cliente: el diagnóstico y sus repuestos quedan bloqueados hasta recibir respuesta.'
            : 'La cotización fue aprobada: el diagnóstico y sus repuestos ya no pueden modificarse.'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>

        {/* Hallazgos del técnico */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B' }}>Hallazgos del técnico</span>

          <div className="input-group">
            <label className="input-label">Técnico responsable</label>
            <select
              className="input-field"
              value={diagTecnicoId}
              onChange={(e) => setDiagTecnicoId(e.target.value)}
              // Un técnico solo puede registrar el diagnóstico a su nombre; el
              // administrador elige a quién asignarlo mientras no exista.
              disabled={diagnostico !== null || esTecnico}
            >
              <option value="">-- Seleccionar técnico --</option>
              {tecnicos.filter((t) => t.activo).map((t) => (
                <option key={t.idTecnico} value={String(t.idTecnico)}>{t.nombre} {t.apellido}</option>
              ))}
            </select>
          </div>

          <Input
            label="Problema encontrado *"
            placeholder="Ej. El equipo no enciende, no carga al conectar..."
            value={diagProblema}
            onChange={(e) => setDiagProblema(e.target.value)}
            disabled={diagnosticoBloqueado}
          />
          <Input
            label="Causa Raíz"
            placeholder="Ej. Conector USB-C dañado por uso excesivo..."
            value={diagCausa}
            onChange={(e) => setDiagCausa(e.target.value)}
            disabled={diagnosticoBloqueado}
          />

          <div className="grid-2">
            <Input
              label="Tiempo estimado (horas)"
              type="number"
              min={0}
              step="0.5"
              placeholder="Ej. 4"
              value={diagTiempo}
              onChange={(e) => setDiagTiempo(e.target.value)}
              disabled={diagnosticoBloqueado}
            />
            <div className="input-group">
              <label className="input-label">Nivel de complejidad</label>
              <select
                className="input-field"
                value={diagComplejidad}
                onChange={(e) => setDiagComplejidad(e.target.value as '' | ComplejidadDiagnostico)}
                disabled={diagnosticoBloqueado}
              >
                <option value="">-- Sin definir --</option>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Observaciones adicionales</label>
            <textarea
              className="input-field"
              rows={2}
              value={diagObs}
              onChange={(e) => setDiagObs(e.target.value)}
              disabled={diagnosticoBloqueado}
            />
          </div>
        </div>

        {/* Resumen Económico + SLA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
              Resumen Económico
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Repuestos ({diagnostico?.repuestos.length ?? 0})</span>
                <strong>{formatMoney(montoRepuestosDiagnostico)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Tiempo estimado</span>
                <strong>{diagnostico?.tiempoEstimadoHoras != null ? `${diagnostico.tiempoEstimadoHoras} h` : '—'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Complejidad</span>
                <strong>{diagnostico?.complejidad ?? '—'}</strong>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#EDE9FE', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#3730A3' }}>
            <strong>⏱ SLA:</strong> Una vez aprobada la cotización, la reparación inicia en menos de 4 horas hábiles.
          </div>
        </div>

      </div>

      {/* Repuestos Requeridos */}
      <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
              Repuestos requeridos
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {!diagnostico
                ? 'Guarda primero el diagnóstico para agregar repuestos'
                : diagnosticoBloqueado
                  ? 'Repuestos bloqueados por el estado de la cotización'
                  : 'Selecciona directamente del inventario del taller'}
            </span>
          </div>

          <button
            onClick={() => setIsInventoryModalOpen(true)}
            disabled={!diagnostico || diagnosticoBloqueado}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              backgroundColor: diagnostico && !diagnosticoBloqueado ? '#3730A3' : '#CBD5E1',
              color: '#FFFFFF',
              border: 'none',
              cursor: diagnostico && !diagnosticoBloqueado ? 'pointer' : 'not-allowed'
            }}
          >
            <Plus size={16} /> Agregar Repuesto
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#EDE9FE', color: '#3730A3' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>REPUESTO</th>
              <th style={{ padding: '8px 12px', textAlign: 'center' }}>CANT.</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>PRECIO</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>SUBTOTAL</th>
              <th style={{ padding: '8px 12px', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {(diagnostico?.repuestos ?? []).map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600' }}>{p.nombreRepuesto}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{p.cantidad}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatMoney(p.precioUnitario)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700' }}>{formatMoney(p.subtotal)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEliminarRepuesto(p.id)}
                    disabled={isSaving || diagnosticoBloqueado}
                    style={{
                      color: diagnosticoBloqueado ? '#CBD5E1' : '#EF4444',
                      background: 'none',
                      border: 'none',
                      cursor: diagnosticoBloqueado ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {(diagnostico?.repuestos ?? []).length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '14px 12px', textAlign: 'center', color: '#94A3B8' }}>
                  Sin repuestos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button variant="outline" disabled={isSaving || diagnosticoBloqueado} onClick={handleGuardarDiagnostico}>
          {diagnostico ? 'Guardar cambios' : 'Guardar diagnóstico'}
        </Button>
        {/* El técnico no cotiza: su siguiente paso es registrar evidencia. */}
        <Button
          variant="primary"
          style={{ backgroundColor: '#3730A3' }}
          disabled={!diagnostico}
          onClick={() => setActiveSubTab(esTecnico ? 'evi' : 'cot')}
        >
          {esTecnico ? 'Ir a evidencia' : 'Ir a cotización'}
        </Button>
      </div>
    </Card>
  );
};
