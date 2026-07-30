import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const ENLACES: { to: string; label: string }[] = [
  { to: '/', label: 'Inicio' },
  { to: '/#beneficios', label: 'Beneficios' },
  { to: '/#precios', label: 'Precios' },
  { to: '/consultar-reparacion', label: 'Consultar Reparación' },
  { to: '/buscar-talleres', label: 'Buscar Talleres' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  const enlaces = ENLACES.map((enlace) => {
    // Los enlaces con ancla no marcan página activa: apuntan a una sección.
    const activo = !enlace.to.includes('#') && location.pathname === enlace.to;

    return (
      <Link
        key={enlace.to}
        to={enlace.to}
        className={`navbar-link${activo ? ' is-active' : ''}`}
        onClick={cerrarMenu}
      >
        {enlace.label}
      </Link>
    );
  });

  const acciones = (
    <>
      <Link
        to="/login"
        className="navbar-link"
        style={{ fontWeight: '600', color: '#3730A3', padding: '8px 12px' }}
        onClick={cerrarMenu}
      >
        Iniciar Sesión
      </Link>
      <Link to="/precios" onClick={cerrarMenu}>
        <Button variant="primary">Solicitar Demo</Button>
      </Link>
    </>
  );

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Marca */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} onClick={cerrarMenu}>
            <img
              src="/logos/Logo 1.png"
              alt="Kolvix Logo"
              style={{ height: '36px', objectFit: 'contain' }}
            />
          </Link>

          {/* Navegación de escritorio */}
          <nav className="navbar-desktop navbar-desktop-links">
            {enlaces}
          </nav>

          <div className="navbar-desktop navbar-desktop-actions">
            {acciones}
          </div>

          {/* Botón del menú en pantallas angostas */}
          <button
            className="navbar-toggle"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Menú desplegable: solo se muestra en pantallas angostas (ver index.css) */}
        {menuAbierto && (
          <nav className="navbar-mobile">
            {enlaces}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0'
            }}>
              {acciones}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
