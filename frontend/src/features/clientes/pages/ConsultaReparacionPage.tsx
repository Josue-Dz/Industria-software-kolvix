import React, { useState } from 'react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Search, CheckCircle, Clock } from 'lucide-react';

export const ConsultaReparacionPage: React.FC = () => {
  const [code, setCode] = useState('ORD-2026-089');
  const [searched, setSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      <section style={{ backgroundColor: '#3730A3', color: '#FFFFFF', padding: '60px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
            Consultar Estado de Reparación
          </h1>
          <p style={{ fontSize: '15px', color: '#EDE9FE', marginBottom: '28px' }}>
            Revisa en tiempo real el progreso de tu equipo en el taller
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '16px' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Ingresa tu código de orden (Ej: ORD-2026-089)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                icon={<Search size={20} />}
                style={{ border: 'none', boxShadow: 'none' }}
              />
            </div>
            <Button type="submit" variant="accent" style={{ borderRadius: '12px', padding: '12px 24px' }}>
              Buscar
            </Button>
          </form>
        </div>
      </section>

      {searched && (
        <section style={{ padding: '48px 0 80px 0', flex: 1 }}>
          <div className="container" style={{ maxWidth: '840px' }}>
            <Card style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
                    Orden Registrada
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B' }}>
                    Orden #{code}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>Taller: TechFix Tegucigalpa</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>Fecha de Ingreso</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E1B4B' }}>20 Julio 2026</span>
                </div>
              </div>

              {/* Device Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '24px 0', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Dispositivo</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>iPhone 13 Pro</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Servicio</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>Cambio de pantalla</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Estado Actual</span>
                  <span className="badge badge-warning">En Proceso</span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div style={{ paddingTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '24px' }}>
                  Progreso de la reparación
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                  {/* Step 1 */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>Ingreso al taller</h4>
                      <p style={{ fontSize: '13px', color: '#64748B' }}>Equipo recibido y registrado con fotos de evidencia inicial.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>Diagnóstico realizado</h4>
                      <p style={{ fontSize: '13px', color: '#64748B' }}>Pantalla rota detectada. Repuesto disponible en inventario.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FEF9C3', color: '#854D0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>En Proceso de reparación</h4>
                      <p style={{ fontSize: '13px', color: '#64748B' }}>El técnico asignado está efectuando el cambio de componente.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', opacity: 0.5 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      4
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>Listo para entrega</h4>
                      <p style={{ fontSize: '13px', color: '#64748B' }}>Control de calidad completado. Puedes retirar tu equipo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};
