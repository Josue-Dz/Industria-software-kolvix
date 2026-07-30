import React from 'react';

// Pantalla breve mientras se comprueba la sesión contra el backend.
export const PantallaCargando: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFD',
    color: '#3730A3',
    fontSize: '15px',
    fontWeight: '600',
  }}>
    Verificando sesión...
  </div>
);
