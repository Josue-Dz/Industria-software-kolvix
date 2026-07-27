import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { formatMoney, formatDate, ESTADO_COTIZACION_LABEL } from './shared';
import type { DetalleOrdenController } from './useDetalleOrden';
import type { OrdenTrabajoResponse } from '../../../api/types';

interface CotizacionTabProps {
  d: DetalleOrdenController;
  orden: OrdenTrabajoResponse;
}

export const CotizacionTab: React.FC<CotizacionTabProps> = ({ d, orden }) => {
  const {
    diagnostico, cotizaciones, cotizacionActual, diagnosticoBloqueado, isSaving,
    montoRepuestosDiagnostico, manoObra, setManoObra, obsInterna, setObsInterna,
    obsCliente, setObsCliente,
    handleGenerarCotizacion, handleGuardarBorrador, handleEnviarCotizacion, handleDecisionCotizacion,
  } = d;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            {cotizacionActual ? `Cotización V${cotizacionActual.version}` : 'Nueva Cotización'}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Propuesta comercial • {orden.nombreCliente} • {formatDate(cotizacionActual?.fechaCreacion ?? orden.fechaIngreso)}
          </p>
        </div>
      </div>

      {!diagnostico ? (
        <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', color: '#94A3B8', fontSize: '14px' }}>
          Para generar una cotización primero registra el diagnóstico técnico de la orden.
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

          {/* Quote Invoice Card */}
          <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>COTIZACIÓN</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B' }}>
                  {cotizacionActual ? `${orden.numeroOrden} · V${cotizacionActual.version}` : `${orden.numeroOrden} · Borrador`}
                </span>
                {cotizacionActual?.fechaEnvio && (
                  <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Enviada el {formatDate(cotizacionActual.fechaEnvio)}</span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3' }}>{orden.nombreCliente}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>{orden.dispositivoResumen}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Seguimiento: {orden.codigoSeguimiento}</span>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>REPUESTO</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>CANT.</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>PRECIO</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {diagnostico.repuestos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px', fontWeight: '600' }}>{p.nombreRepuesto}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{p.cantidad}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{formatMoney(p.precioUnitario)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: '700' }}>{formatMoney(p.subtotal)}</td>
                  </tr>
                ))}
                {diagnostico.repuestos.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '12px 8px', textAlign: 'center', color: '#94A3B8' }}>
                      Sin repuestos en el diagnóstico.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Subtotals & Total */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right', fontSize: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
              {/* Con cotización ENVIADA/APROBADA se muestran los montos congelados de esa
                  cotización; mientras sea editable, los montos se calculan en vivo con los
                  repuestos actuales del diagnóstico. */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Subtotal repuestos</span>
                <span>{formatMoney(diagnosticoBloqueado && cotizacionActual ? cotizacionActual.montoRepuestos : montoRepuestosDiagnostico)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Mano de obra</span>
                <span>{formatMoney(diagnosticoBloqueado && cotizacionActual ? cotizacionActual.montoManoObra : Number(manoObra) || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#1E1B4B', marginTop: '6px' }}>
                <span>TOTAL</span>
                <span>{formatMoney(diagnosticoBloqueado && cotizacionActual ? cotizacionActual.montoTotal : (Number(manoObra) || 0) + montoRepuestosDiagnostico)}</span>
              </div>
            </div>

            {/* Terms Note */}
            <div style={{ backgroundColor: '#EDE9FE', borderRadius: '10px', padding: '10px 14px', marginTop: '16px', fontSize: '11px', color: '#3730A3' }}>
              <strong>Términos:</strong> Garantía de 90 días sobre los repuestos instalados. La aprobación de esta cotización autoriza al taller a iniciar las reparaciones descritas.
            </div>
          </Card>

          {/* Status and Action Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Estado */}
            <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
                Estado de la cotización
              </span>
              <div style={{ backgroundColor: '#EDE9FE', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3', display: 'block' }}>
                  {cotizacionActual ? (ESTADO_COTIZACION_LABEL[cotizacionActual.estado] ?? cotizacionActual.estado) : 'Sin generar'}
                </span>
                {cotizacionActual?.fechaRespuesta && (
                  <span style={{ fontSize: '11px', color: '#6366F1' }}>Respuesta: {formatDate(cotizacionActual.fechaRespuesta)}</span>
                )}
                {cotizacionActual?.observacionCliente && (
                  <span style={{ fontSize: '11px', color: '#6366F1', display: 'block' }}>"{cotizacionActual.observacionCliente}"</span>
                )}
              </div>
              {cotizaciones.length > 1 && (
                <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginTop: '8px' }}>
                  Versiones registradas: {[...cotizaciones].sort((a, b) => a.version - b.version).map((c) => `V${c.version}`).join(' · ')}
                </span>
              )}
            </Card>

            {/* Borrador / Generar */}
            {(!cotizacionActual || cotizacionActual.estado === 'PENDIENTE'
              || cotizacionActual.estado === 'RECHAZADA' || cotizacionActual.estado === 'VENCIDA' || cotizacionActual.estado === 'CANCELADA') && (
              <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
                  {cotizacionActual && cotizacionActual.estado === 'PENDIENTE' ? 'Editar borrador' : 'Generar cotización'}
                </span>
                <Input
                  label="MANO DE OBRA (L.)"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Ej. 500"
                  value={manoObra}
                  onChange={(e) => setManoObra(e.target.value)}
                />
                <div className="input-group">
                  <label className="input-label">OBSERVACIÓN INTERNA</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={obsInterna}
                    onChange={(e) => setObsInterna(e.target.value)}
                    maxLength={500}
                  />
                </div>
                {cotizacionActual && cotizacionActual.estado === 'PENDIENTE' ? (
                  <>
                    <Button variant="outline" size="sm" style={{ width: '100%', borderRadius: '10px' }} disabled={isSaving} onClick={handleGuardarBorrador}>
                      Guardar borrador
                    </Button>
                    <Button variant="primary" size="sm" style={{ width: '100%', backgroundColor: '#3730A3', borderRadius: '10px' }} disabled={isSaving} icon={<Send size={16} />} onClick={handleEnviarCotizacion}>
                      Enviar al cliente
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" size="sm" style={{ width: '100%', backgroundColor: '#3730A3', borderRadius: '10px' }} disabled={isSaving} onClick={handleGenerarCotizacion}>
                    {cotizacionActual ? 'Generar nueva versión' : 'Generar cotización'}
                  </Button>
                )}
              </Card>
            )}

            {/* Decisión manual */}
            {cotizacionActual?.estado === 'ENVIADA' && (
              <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
                  Decisión del cliente
                </span>
                <Input
                  placeholder="Observación del cliente (opcional)"
                  value={obsCliente}
                  onChange={(e) => setObsCliente(e.target.value)}
                  maxLength={500}
                />
                <Button variant="primary" size="sm" style={{ width: '100%', backgroundColor: '#3730A3', borderRadius: '10px' }} disabled={isSaving} icon={<CheckCircle size={16} />} onClick={() => handleDecisionCotizacion('APROBADA')}>
                  Marcar como aprobada
                </Button>
                <Button variant="outline" size="sm" style={{ width: '100%', color: '#EF4444', borderColor: '#FCA5A5', borderRadius: '10px' }} disabled={isSaving} icon={<XCircle size={16} />} onClick={() => handleDecisionCotizacion('RECHAZADA')}>
                  Marcar como rechazada
                </Button>
              </Card>
            )}

          </div>
        </div>
      )}
    </>
  );
};
