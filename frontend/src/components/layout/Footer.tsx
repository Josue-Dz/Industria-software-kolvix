import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#1E1B4B',
      color: '#FFFFFF',
      paddingTop: '64px',
      paddingBottom: '32px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Brand & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/src/assets/logos/Logo 4.png"
                alt="Kolvix Logo"
                style={{ height: '36px', objectFit: 'contain' }}
              />
            </div>
            <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '300px' }}>
              Centraliza y simplifica la gestión de tu taller o servicio técnico.
            </p>
            {/* Social Icons Placeholder */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                f
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                X
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#3730A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                in
              </div>
            </div>
          </div>

          {/* Col 1: Producto */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#FFFFFF' }}>
              Producto
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
              <li><a href="#beneficios" style={{ transition: 'color 0.2s' }}>Características</a></li>
              <li><a href="#precios">Precios</a></li>
            </ul>
          </div>

          {/* Col 2: Clientes */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#FFFFFF' }}>
              Clientes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
              <li><Link to="/consultar-reparacion">Seguir reparación</Link></li>
              <li><Link to="/buscar-talleres">Buscar Talleres</Link></li>
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#FFFFFF' }}>
              Contacto
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#CBD5E1' }}>
              <li>info@kolvix.hn</li>
              <li>+504 2220-0000</li>
              <li>Tegucigalpa, Honduras</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          textAlign: 'center',
          paddingTop: '24px',
          fontSize: '13px',
          color: '#94A3B8'
        }}>
          © 2026 Kolvix. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
