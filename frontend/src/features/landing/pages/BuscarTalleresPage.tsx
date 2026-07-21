import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Search, MapPin, Clock, Star, Wrench } from 'lucide-react';

export const BuscarTalleresPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Todas', 'Celulares', 'Laptops', 'Tablets', 'Consolas', 'Electrodomésticos'];

  const talleres = [
    {
      id: 'techfix',
      name: 'TechFix',
      category: 'Celulares',
      rating: 4.8,
      reviews: 120,
      location: 'Tegucigalpa',
      hours: 'Abre a las 8:00 A.M'
    },
    {
      id: 'smart-repair',
      name: 'Smart Repair',
      category: 'Laptops',
      rating: 4.6,
      reviews: 98,
      location: 'San Pedro Sula',
      hours: 'Abre a las 8:00 A.M'
    },
    {
      id: 'fix-center',
      name: 'Fix Center',
      category: 'Electrodomésticos',
      rating: 4.5,
      reviews: 86,
      location: 'Tegucigalpa',
      hours: 'Abre a las 8:00 A.M'
    },
    {
      id: 'servitech',
      name: 'Servitech',
      category: 'Consolas',
      rating: 4.5,
      reviews: 65,
      location: 'Tegucigalpa',
      hours: 'Abre a las 8:00 A.M'
    }
  ];

  const filteredTalleres = talleres.filter(t => {
    const matchesCategory = selectedCategory === 'Todas' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      {/* Header Banner */}
      <section style={{ backgroundColor: '#3730A3', color: '#FFFFFF', padding: '60px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
            Encuentra el taller ideal para tu equipo
          </h1>
          <p style={{ fontSize: '16px', color: '#EDE9FE', marginBottom: '32px' }}>
            Busca por ubicación, categoría y reputación
          </p>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '30px', padding: '6px 12px', display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="Buscar taller o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} />}
              style={{ border: 'none', boxShadow: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* Filter and Content Section */}
      <section style={{ padding: '48px 0 80px 0', flex: 1 }}>
        <div className="container">
          {/* Categories and Sort Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: selectedCategory === cat ? '#6366F1' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                    border: selectedCategory === cat ? 'none' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#3730A3',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              <option>Mejor Calificación</option>
              <option>Más Cercanos</option>
            </select>
          </div>

          {/* Talleres Cards Grid */}
          <div className="grid-3">
            {filteredTalleres.map((taller) => (
              <Card key={taller.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#1E1B4B',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Wrench size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B' }}>{taller.name}</h3>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{taller.category}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontWeight: '700', color: '#1E1B4B' }}>{taller.rating}</span>
                    <span style={{ color: '#64748B' }}>({taller.reviews} reseñas)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#64748B" />
                    <span>{taller.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="#64748B" />
                    <span>{taller.hours}</span>
                  </div>
                </div>

                <Link to={`/taller/${taller.id}`}>
                  <Button variant="accent" style={{ width: '100%', borderRadius: '10px' }}>
                    Ver perfil del taller
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
