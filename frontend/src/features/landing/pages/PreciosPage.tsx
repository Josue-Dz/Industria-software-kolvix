import React from 'react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { PlanesGrid } from '../components/PlanesGrid';

export const PreciosPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      <section className="public-hero">
        <div className="container" style={{ maxWidth: '720px' }}>
          <h1 className="public-hero-title">
            Planes para cada tamaño de taller
          </h1>
          <p className="public-hero-text">
            Elige el plan que mejor se adapte a tu operación. Puedes cambiarlo más adelante.
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ flex: 1 }}>
        <div className="container">
          <PlanesGrid />
        </div>
      </section>

      <Footer />
    </div>
  );
};
