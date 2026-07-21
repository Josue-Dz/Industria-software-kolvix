import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { 
  ClipboardList, 
  Camera, 
  Bell, 
  Package, 
  Wrench, 
  Headset, 
  ShieldCheck, 
  Cloud 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: '80px 0 60px 0', overflow: 'hidden' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Text Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#1E1B4B',
              lineHeight: 1.15,
              letterSpacing: '-1px'
            }}>
              Gestiona tu taller.<br />
              Conecta con más <span style={{ color: '#6366F1' }}>clientes.</span> Crece <span style={{ color: '#6366F1' }}>sin límites.</span>
            </h1>

            <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, maxWidth: '540px' }}>
              Kolvix es la plataforma inteligente que ayuda a talleres técnicos a digitalizar procesos, aumentar su productividad y conectar con clientes que buscan servicios confiables.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
              <Link to="/login">
                <Button variant="primary" style={{ backgroundColor: '#3730A3', padding: '16px 32px', borderRadius: '12px' }}>
                  Solicitar Demo &gt;
                </Button>
              </Link>
              <Link to="/buscar-talleres">
                <Button variant="outline" style={{ padding: '16px 32px', borderRadius: '12px' }}>
                  Buscar Talleres
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Mockup Graphic */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
              border: '1px solid #EDE9FE'
            }}>
              {/* Animated / Rendered Interface Preview */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
                  <div style={{ width: '140px', height: '14px', borderRadius: '7px', backgroundColor: '#3730A3' }} />
                </div>
                <div style={{ width: '100%', height: '32px', borderRadius: '8px', backgroundColor: '#EDE9FE' }} />
                <div style={{ width: '100%', height: '32px', borderRadius: '8px', backgroundColor: '#EDE9FE' }} />
                <div style={{ width: '80%', height: '32px', borderRadius: '8px', backgroundColor: '#EDE9FE' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section style={{ padding: '60px 0 80px 0', backgroundColor: '#FFFFFF' }} id="beneficios">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1E1B4B' }}>
              Todo lo que <span style={{ color: '#6366F1' }}>necesitas</span> en un solo lugar
            </h2>
            <p style={{ color: '#64748B', fontSize: '16px', marginTop: '8px' }}>
              Centraliza y simplifica la gestión de tu taller o servicio técnico
            </p>
          </div>

          <div className="grid-4" style={{ marginBottom: '32px' }}>
            {/* Card 1 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ClipboardList size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Órdenes de reparación
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Crea, organiza y da seguimiento a todas tus órdenes en tiempo real.
              </p>
            </Card>

            {/* Card 2 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Camera size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Evidencia visual
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Fotos al ingreso y entrega del equipo para mayor transparencia.
              </p>
            </Card>

            {/* Card 3 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Bell size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Notificaciones
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                WhatsApp y correo automáticos con estados actualizados.
              </p>
            </Card>

            {/* Card 4 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Package size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Inventario
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Controla tu inventario y recibe alertas de stock bajo en tiempo real.
              </p>
            </Card>
          </div>

          <div className="grid-4">
            {/* Card 5 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Wrench size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Fácil de usar
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Interface intuitiva diseñada para agilizar el trabajo diario.
              </p>
            </Card>

            {/* Card 6 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Headset size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Soporte local
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Acompañamiento cercano y respuesta oportuna cuando lo necesites.
              </p>
            </Card>

            {/* Card 7 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Seguro y confiable
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Protegemos tu información y la privacidad de tus clientes.
              </p>
            </Card>

            {/* Card 8 */}
            <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDE9FE', textAlign: 'left' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Cloud size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
                Acceso en la nube
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Tu información siempre disponible y segura desde cualquier dispositivo.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
