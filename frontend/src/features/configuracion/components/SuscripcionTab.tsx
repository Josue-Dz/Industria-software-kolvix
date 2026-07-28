import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Sparkles, Landmark } from 'lucide-react';
import type { ConfiguracionController } from '../useConfiguracion';

const formatMonto = (monto: number, moneda: string) =>
  `${moneda === 'HNL' ? 'L.' : '$'} ${Number(monto).toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

export const SuscripcionTab: React.FC<{ c: ConfiguracionController }> = ({ c }) => {
  const { empresa, planActual, planes, cuentasCobro } = c;

  if (!empresa) return null;

  return (
    <>
      {/* Plan contratado */}
      <Card hoverable={false} style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
        color: '#FFFFFF',
        padding: '32px',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px', right: '-20px',
          width: '120px', height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          filter: 'blur(10px)'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 2 }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#A78BFA' }}>
            PLAN ACTUAL
          </span>
          <h3 style={{ fontSize: '28px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            {empresa.nombrePlan} <Sparkles size={20} color="#FBBF24" />
          </h3>
          <p style={{ fontSize: '14px', color: '#CBD5E1', margin: 0 }}>
            {planActual?.descripcion ?? `Código de plan: ${empresa.codigoPlan}`}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: empresa.activo ? '#10B981' : '#EF4444',
              color: '#FFFFFF'
            }}>
              {empresa.activo ? 'ACTIVO' : 'SUSPENDIDO'}
            </span>
            <span style={{ fontSize: '13px', color: '#A78BFA' }}>
              Cliente desde {new Date(empresa.fechaRegistro).toLocaleDateString('es-HN', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2 }}>
          {planActual ? (
            <>
              <span style={{ fontSize: '36px', fontWeight: '800', color: '#FFFFFF' }}>
                {formatMonto(planActual.montoMensual, planActual.moneda)}
                <span style={{ fontSize: '16px', fontWeight: '500' }}> {planActual.moneda}/mes</span>
              </span>
              <span style={{ fontSize: '12px', color: '#A78BFA' }}>Facturación mensual</span>
            </>
          ) : (
            <span style={{ fontSize: '13px', color: '#A78BFA' }}>Monto del plan no disponible</span>
          )}
        </div>
      </Card>

      {/* Catálogo de planes */}
      {planes.length > 0 && (
        <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Planes disponibles
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
              Para cambiar de plan, contacta al equipo de Kolvix desde la sección de Soporte.
            </p>
          </div>

          <div className="grid-3">
            {planes.map((plan) => {
              const esActual = plan.codigo === empresa.codigoPlan;
              return (
                <div key={plan.codigo} style={{
                  border: esActual ? '2px solid #3730A3' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px',
                  backgroundColor: esActual ? '#F4F0FF' : '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>{plan.nombre}</span>
                    {esActual && (
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#FFFFFF', backgroundColor: '#3730A3', padding: '3px 8px', borderRadius: '10px' }}>
                        ACTUAL
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: '#3730A3' }}>
                    {formatMonto(plan.montoMensual, plan.moneda)}
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}> /mes</span>
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                    {plan.descripcion ?? 'Sin descripción'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Cuentas donde el taller paga su suscripción */}
      <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Dónde pagar tu suscripción
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
            Cuentas bancarias de Kolvix para el pago mensual
          </p>
        </div>

        {cuentasCobro.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '13px',
            color: '#92400E'
          }}>
            Kolvix aún no ha publicado cuentas de cobro. La tabla <strong>cuentas_cobro</strong> está vacía;
            en cuanto se registre una cuenta aparecerá aquí automáticamente.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cuentasCobro.map((cuenta) => (
              <div key={cuenta.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '18px 20px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#EDE9FE',
                  color: '#3730A3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Landmark size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                    {cuenta.banco}
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EDE9FE', color: '#3730A3', marginLeft: '6px' }}>
                      {cuenta.moneda}
                    </span>
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748B', fontFamily: 'monospace' }}>
                    {cuenta.numeroCuenta}
                  </span>
                  {cuenta.instrucciones && (
                    <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                      {cuenta.instrucciones}
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Titular</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>{cuenta.titular}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};
