import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Check } from 'lucide-react';
import { catalogosService } from '../../../api/services/catalogosService';
import type { PlanSuscripcionResponse } from '../../../api/types';

// Copy de marketing por plan. El nombre, la descripción y el precio vienen de la
// base de datos; aquí solo vive el detalle comercial que la BD no modela.
const PRESENTACION_PLAN: Record<string, { caracteristicas: string[]; destacado: boolean }> = {
  BASICO: {
    caracteristicas: [
      'Registro de órdenes',
      'Gestión básica de clientes',
      'Reportes básicos',
    ],
    destacado: false,
  },
  PROFESIONAL: {
    caracteristicas: [
      'Todo lo del plan Básico',
      'Evidencia fotográfica',
      'Control de inventario',
      'Notificaciones automáticas',
    ],
    destacado: true,
  },
  EMPRESARIAL: {
    caracteristicas: [
      'Todo lo del plan Profesional',
      'Soporte prioritario',
      'Personalización avanzada',
    ],
    destacado: false,
  },
};

// El cupo de usuarios sí lo aplica el backend, así que se muestra desde la BD.
const vinetaUsuarios = (maxUsuarios: number | null): string =>
  maxUsuarios === null
    ? 'Usuarios ilimitados'
    : `Hasta ${maxUsuarios} ${maxUsuarios === 1 ? 'usuario' : 'usuarios'}`;

const formatoMonto = (monto: number, moneda: string): string => {
  try {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2,
    }).format(monto);
  } catch {
    // Moneda no reconocida por Intl: se muestra el código tal cual viene de la BD.
    return `${moneda} ${monto.toFixed(2)}`;
  }
};

export const PreciosPage: React.FC = () => {
  const [planes, setPlanes] = useState<PlanSuscripcionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    catalogosService.listarPlanes()
      .then((data) => {
        if (isMounted) setPlanes(data);
      })
      .catch(() => {
        if (isMounted) setError('No se pudieron cargar los planes en este momento.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      <section style={{ backgroundColor: '#3730A3', color: '#FFFFFF', padding: '60px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
            Planes para cada tamaño de taller
          </h1>
          <p style={{ fontSize: '16px', color: '#EDE9FE' }}>
            Elige el plan que mejor se adapte a tu operación. Puedes cambiarlo más adelante.
          </p>
        </div>
      </section>

      <section style={{ padding: '56px 0 80px 0', flex: 1 }}>
        <div className="container">

          {isLoading && (
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
              Cargando planes...
            </p>
          )}

          {error && !isLoading && (
            <p style={{ textAlign: 'center', color: '#991B1B', fontSize: '15px', fontWeight: '600' }}>
              {error}
            </p>
          )}

          {!isLoading && !error && planes.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
              No hay planes disponibles por el momento.
            </p>
          )}

          {planes.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(planes.length, 3)}, 1fr)`,
              gap: '24px',
              alignItems: 'stretch',
            }}>
              {planes.map((plan) => {
                const presentacion = PRESENTACION_PLAN[plan.codigo];
                const destacado = presentacion?.destacado ?? false;

                return (
                  <Card
                    key={plan.codigo}
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '32px',
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
                      <span style={{ fontSize: '36px', fontWeight: '800', color: '#1E1B4B' }}>
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
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
