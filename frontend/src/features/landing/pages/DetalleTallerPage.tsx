import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { 
  ArrowLeft, 
  Wrench, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2 
} from 'lucide-react';

export const DetalleTallerPage: React.FC = () => {
  const { id } = useParams();

  const tallerInfo = {
    name: id ? id.toUpperCase() : 'TECHFIX',
    rating: 4.8,
    reviews: 120,
    location: 'Tegucigalpa',
    hours: 'Abre 8:00 a.m',
    description: 'Especialistas en reparación de smartphones y tablets con repuestos originales y garantía escrita en cada servicio.',
    tags: ['Celulares', 'Tablets'],
    address: 'Col. Kennedy, Bloque 25, Tegucigalpa',
    phone: '+504 2200-0000',
    email: 'info@techfix.hn',
    schedule: 'Lun a Sáb 8:00 a.m. - 5:00 p.m.',
    services: [
      'Cambio de pantalla',
      'Reparación de placa',
      'Liberación',
      'Cambio de batería',
      'Daño por líquido'
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      {/* Header Banner */}
      <section style={{ backgroundColor: '#3730A3', color: '#FFFFFF', padding: '40px 0 60px 0' }}>
        <div className="container">
          <Link
            to="/buscar-talleres"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#EDE9FE',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px'
            }}
          >
            <ArrowLeft size={16} /> Volver
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Wrench size={32} />
            </div>

            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
                {tallerInfo.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#EDE9FE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontWeight: '700' }}>{tallerInfo.rating}</span>
                  <span>({tallerInfo.reviews} reseñas)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={16} />
                  <span>{tallerInfo.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={16} />
                  <span>{tallerInfo.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Detail Content */}
      <section style={{ padding: '48px 0 80px 0', flex: 1 }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
            {/* Left Card: Sobre el Taller */}
            <Card style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '12px' }}>
                Sobre el taller
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                {tallerInfo.description}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                {tallerInfo.tags.map(tag => (
                  <span key={tag} className="badge badge-purple">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Right Card: Información de contacto */}
            <Card style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '20px' }}>
                Información de contacto
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={18} color="#6366F1" style={{ marginTop: '2px' }} />
                  <span>{tallerInfo.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} color="#6366F1" />
                  <span>{tallerInfo.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} color="#6366F1" />
                  <span>{tallerInfo.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={18} color="#6366F1" />
                  <span>{tallerInfo.schedule}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Bottom Card: Servicios Disponibles */}
          <Card style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '24px' }}>
              Servicios disponibles
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {tallerInfo.services.map(service => (
                <div key={service} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1E293B', fontWeight: '600' }}>
                  <CheckCircle2 size={20} color="#22C55E" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};
