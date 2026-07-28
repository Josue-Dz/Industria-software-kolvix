import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Check } from 'lucide-react';

const PLANES = [
  {
    codigo: 'BASICO',
    nombre: 'Básico',
    precio: 9.99,
    descripcion: 'Plan inicial para talleres que se profesionalizan por primera vez.',
    caracteristicas: [
      'Registro de órdenes',
      'Gestión básica de clientes',
      'Hasta 2 usuarios',
      'Reportes básicos',
    ],
    destacado: false,
  },
  {
    codigo: 'PROFESIONAL',
    nombre: 'Profesional',
    precio: 24.99,
    descripcion: 'Plan para talleres que incluyen fotos y automatizaciones.',
    caracteristicas: [
      'Todo lo del plan Básico',
      'Evidencia fotográfica',
      'Control de inventario',
      'Notificaciones automáticas',
      'Hasta 5 usuarios',
    ],
    destacado: true,
  },
  {
    codigo: 'EMPRESARIAL',
    nombre: 'Empresarial',
    precio: 59.99,
    descripcion: 'Plan para talleres con redes multi-sucursal',
    caracteristicas: [
      'Todo lo del plan Profesional',
      'Usuarios ilimitados',
      'Soporte prioritario',
      'Personalización avanzada',
    ],
    destacado: false,
  },
];

export const PreciosPage: React.FC = () => {
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            alignItems: 'stretch',
          }}>
            {PLANES.map((plan) => (
              <Card
                key={plan.codigo}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '32px',
                  border: plan.destacado ? '2px solid #6366F1' : '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {plan.destacado && (
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
                    $ {plan.precio.toLocaleString('en-US')}
                  </span>
                  <span style={{ fontSize: '14px', color: '#64748B' }}> /mes</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1 }}>
                  {plan.caracteristicas.map((car) => (
                    <div key={car} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Check size={18} color="#22C55E" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '14px', color: '#475569' }}>{car}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/registro?plan=${plan.codigo}`}>
                  <Button
                    variant={plan.destacado ? 'accent' : 'outline'}
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    Elegir {plan.nombre}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};