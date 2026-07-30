import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Check } from 'lucide-react';
import { PRESENTACION_PLAN, formatoMonto, vinetaUsuarios } from '../planes';
import type { PlanSuscripcionResponse } from '../../../api/types';

export const PlanCard: React.FC<{ plan: PlanSuscripcionResponse }> = ({ plan }) => {
  const presentacion = PRESENTACION_PLAN[plan.codigo];
  const destacado = presentacion?.destacado ?? false;

  return (
    <Card
      className="public-card"
      style={{
        backgroundColor: '#FFFFFF',
        border: destacado ? '2px solid #6366F1' : '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {destacado && (
        <span style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '700',
          padding: '4px 14px',
          borderRadius: '20px',
          whiteSpace: 'nowrap',
        }}>
          Más popular
        </span>
      )}

      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '4px' }}>
        {plan.nombre}
      </h3>
      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
        {plan.descripcion}
      </p>

      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: '800', color: '#1E1B4B' }}>
          {formatoMonto(plan.montoMensual, plan.moneda)}
        </span>
        <span style={{ fontSize: '14px', color: '#64748B' }}> /mes</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1 }}>
        {[vinetaUsuarios(plan.maxUsuarios), ...(presentacion?.caracteristicas ?? [])].map((car) => (
          <div key={car} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Check size={18} color="#22C55E" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '14px', color: '#475569' }}>{car}</span>
          </div>
        ))}
      </div>

      <Link to={`/registro?plan=${plan.codigo}`}>
        <Button
          variant={destacado ? 'accent' : 'outline'}
          style={{ width: '100%', borderRadius: '10px' }}
        >
          Elegir {plan.nombre}
        </Button>
      </Link>
    </Card>
  );
};
