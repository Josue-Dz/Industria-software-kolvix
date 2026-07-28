import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Search, MapPin, Clock, Star, Wrench } from 'lucide-react';
import { marketplaceApi } from '../../../api/services/marketplace';
import type { PerfilMarketplace, CategoriaDispositivo } from '../../../api/types.ts';

export const BuscarTalleresPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorias, setCategorias] = useState<CategoriaDispositivo[]>([]);
  const [talleres, setTalleres] = useState<PerfilMarketplace[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar catálogo de categorías una sola vez
  useEffect(() => {
    marketplaceApi.catalogoCategorias().then(setCategorias).catch(console.error);
  }, []);

  // Cargar talleres cuando cambia el filtro de categoría
useEffect(() => {
  let ignore = false;

  const cargarTalleres = async () => {
    setLoading(true);
    try {
      const res = selectedCategory
        ? await marketplaceApi.buscarPorCategoria(selectedCategory)
        : await marketplaceApi.listarTalleres();

      if (!ignore) {
        setTalleres(res.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  cargarTalleres();

  return () => {
    ignore = true;
  };
}, [selectedCategory]);

  const filteredTalleres = talleres.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.nombreEmpresa.toLowerCase().includes(term) ||
      (t.direccionEmpresa ?? '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      <section className="public-hero">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="public-hero-title">
            Encuentra el taller ideal para tu equipo
          </h1>
          <p className="public-hero-text" style={{ marginBottom: '32px' }}>
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

      <section className="section-pad" style={{ flex: 1 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: selectedCategory === null ? '#6366F1' : '#FFFFFF',
                  color: selectedCategory === null ? '#FFFFFF' : '#475569',
                  border: selectedCategory === null ? 'none' : '1px solid #E2E8F0',
                  cursor: 'pointer',
                }}
              >
                Todas
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: selectedCategory === cat.id ? '#6366F1' : '#FFFFFF',
                    color: selectedCategory === cat.id ? '#FFFFFF' : '#475569',
                    border: selectedCategory === cat.id ? 'none' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748B' }}>Cargando talleres...</p>
          ) : filteredTalleres.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748B' }}>No se encontraron talleres.</p>
          ) : (
            <div className="grid-3">
              {filteredTalleres.map((taller) => (
                <Card key={taller.empresaId} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      backgroundColor: '#1E1B4B', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Wrench size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B' }}>{taller.nombreEmpresa}</h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ fontWeight: '700', color: '#1E1B4B' }}>{taller.calificacionPromedio.toFixed(1)}</span>
                      <span style={{ color: '#64748B' }}>({taller.totalReviews} reseñas)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#64748B" />
                      <span>{taller.direccionEmpresa}</span>
                    </div>
                    {taller.horarioAtencion && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} color="#64748B" />
                        <span>{taller.horarioAtencion}</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/taller/${taller.empresaId}`}>
                    <Button variant="accent" style={{ width: '100%', borderRadius: '10px' }}>
                      Ver perfil del taller
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};