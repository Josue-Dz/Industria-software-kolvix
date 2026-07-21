import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '76px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/src/assets/logos/Logo 1.png"
            alt="Kolvix Logo"
            style={{ height: '36px', objectFit: 'contain' }}
          />
        </Link>

        {/* Center Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to="/"
            style={{
              fontSize: '15px',
              fontWeight: location.pathname === '/' ? '700' : '500',
              color: location.pathname === '/' ? '#3730A3' : '#475569',
              transition: 'color 0.2s'
            }}
          >
            Inicio
          </Link>
          <a
            href="#beneficios"
            style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#475569'
            }}
          >
            Beneficios
          </a>
          <Link
            to="/consultar-reparacion"
            style={{
              fontSize: '15px',
              fontWeight: location.pathname === '/consultar-reparacion' ? '700' : '500',
              color: location.pathname === '/consultar-reparacion' ? '#3730A3' : '#475569'
            }}
          >
            Consultar Reparación
          </Link>
          <Link
            to="/buscar-talleres"
            style={{
              fontSize: '15px',
              fontWeight: location.pathname === '/buscar-talleres' ? '700' : '500',
              color: location.pathname === '/buscar-talleres' ? '#3730A3' : '#475569'
            }}
          >
            Buscar Talleres
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/login"
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#3730A3',
              padding: '8px 12px'
            }}
          >
            Iniciar Sesión
          </Link>
          <Link to="/login">
            <Button variant="primary" style={{ backgroundColor: '#3730A3', borderRadius: '10px' }}>
              Solicitar Demo
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
