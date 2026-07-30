import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { ArrowLeft, Wrench, Star, MapPin, Clock, Phone, Mail} from 'lucide-react';
import { marketplaceApi } from '../../../api/services/marketplace';
import type { PerfilMarketplace, CategoriaServicio, Review } from '../../../api/types.ts';

export const DetalleTallerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [perfil, setPerfil] = useState<PerfilMarketplace | null>(null);
  const [categorias, setCategorias] = useState<CategoriaServicio[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const idEmpresa = Number(id);

    Promise.all([
      marketplaceApi.verPerfil(idEmpresa),
      marketplaceApi.categoriasDelTaller(idEmpresa),
      marketplaceApi.reviewsDelTaller(idEmpresa),
    ])
      .then(([perfilData, categoriasData, reviewsData]) => {
        setPerfil(perfilData);
        setCategorias(categoriasData);
        setReviews(reviewsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '60px' }}>Cargando taller...</p>;
  }

  if (!perfil) {
    return <p style={{ textAlign: 'center', padding: '60px' }}>Taller no encontrado.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      <section style={{ backgroundColor: '#3730A3', color: '#FFFFFF', padding: '40px 0 60px 0' }}>
        <div className="container">
          <Link to="/buscar-talleres" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#EDE9FE', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Volver
          </Link>

          <div className="taller-hero-header">
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Wrench size={32} />
            </div>

            <div>
              <h1 className="taller-hero-title">
                {perfil.nombreEmpresa}
              </h1>
              <div className="taller-hero-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontWeight: '700' }}>{perfil.calificacionPromedio.toFixed(1)}</span>
                  <span>({perfil.totalReviews} reseñas)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={16} />
                  <span>{perfil.direccionEmpresa}</span>
                </div>
                {perfil.horarioAtencion && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={16} />
                    <span>{perfil.horarioAtencion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ flex: 1 }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          <div className="detalle-taller-grid">
            <Card className="public-card" style={{ backgroundColor: '#FFFFFF' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '12px' }}>
                Sobre el taller
              </h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                {perfil.descripcionPublica ?? 'Este taller aún no ha agregado una descripción.'}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {categorias.map((cat) => (
                  <span key={cat.id} className="badge badge-purple">
                    {cat.categoriaNombre}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="public-card" style={{ backgroundColor: '#FFFFFF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '20px' }}>
                Información de contacto
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={18} color="#6366F1" style={{ marginTop: '2px' }} />
                  <span>{perfil.direccionEmpresa}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} color="#6366F1" />
                  <span>{perfil.telefonoEmpresa}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} color="#6366F1" />
                  <span>{perfil.correoEmpresa}</span>
                </div>
                {perfil.horarioAtencion && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={18} color="#6366F1" />
                    <span>{perfil.horarioAtencion}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="public-card" style={{ backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '24px' }}>
              Reseñas de clientes
            </h3>

            {reviews.length === 0 ? (
              <p style={{ color: '#64748B' }}>Este taller aún no tiene reseñas.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ fontWeight: '700' }}>{r.calificacion} / 5</span>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>— {r.clienteNombre}</span>
                    </div>
                    {r.comentario && <p style={{ color: '#475569' }}>{r.comentario}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};