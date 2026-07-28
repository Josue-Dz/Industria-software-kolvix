import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { UserRole } from '../api/types';

// Landing Feature
import { LandingPage } from '../features/landing/pages/LandingPage';
import { BuscarTalleresPage } from '../features/landing/pages/BuscarTalleresPage';
import { DetalleTallerPage } from '../features/landing/pages/DetalleTallerPage';
import { PreciosPage } from '../features/landing/pages/PreciosPage';

// Auth Feature
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegistroPage } from '../features/auth/pages/RegistroPage';


// Clientes Feature
import { ConsultaReparacionPage } from '../features/clientes/pages/ConsultaReparacionPage';

// Dashboard Feature
import { DashboardTallerPage } from '../features/dashboard/pages/DashboardTallerPage';
import { DashboardTecnicoPage } from '../features/dashboard/pages/DashboardTecnicoPage';

// Ordenes Feature
import { OrdenesPage } from '../features/ordenes/pages/OrdenesPage';
import { NuevaOrdenPage } from '../features/ordenes/pages/NuevaOrdenPage';
import { DiagnosticoOrdenPage } from '../features/ordenes/pages/DiagnosticoOrdenPage';
import { EvidenciaOrdenPage } from '../features/ordenes/pages/EvidenciaOrdenPage';
import { DetalleOrdenPage } from '../features/ordenes/pages/DetalleOrdenPage';

// Tecnicos Feature
import { TecnicosPage } from '../features/tecnicos/pages/TecnicosPage';

// Inventario Feature
import { InventarioDashboardPage } from '../features/inventario/pages/InventarioDashboardPage';
import { MovimientosInventarioPage } from '../features/inventario/pages/MovimientosInventarioPage';
import { RegistroRepuestosPage } from '../features/inventario/pages/RegistroRepuestosPage';

// Configuracion & Soporte Features
import { ConfiguracionPage } from '../features/configuracion/pages/ConfiguracionPage';
import { SoportePage } from '../features/soporte/pages/SoportePage';

import { ScrollToHash } from './ScrollToHash';
import { AuthProvider } from '../auth/AuthProvider';
import { RutaProtegida } from '../auth/RutaProtegida';
import { RutaSoloInvitados } from '../auth/RutaSoloInvitados';

const ROLES_ADMIN: UserRole[] = ['ADMIN', 'PROPIETARIO'];

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToHash />
        <Routes>
          {/* ---- Rutas públicas ---- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/buscar-talleres" element={<BuscarTalleresPage />} />
          <Route path="/taller/:id" element={<DetalleTallerPage />} />
          <Route path="/consultar-reparacion" element={<ConsultaReparacionPage />} />
          <Route path="/precios" element={<PreciosPage />} />

          {/* ---- Solo para visitantes sin sesión ---- */}
          <Route path="/login" element={<RutaSoloInvitados><LoginPage /></RutaSoloInvitados>} />
          <Route path="/registro" element={<RutaSoloInvitados><RegistroPage /></RutaSoloInvitados>} />

          {/* ---- Rutas privadas: ---- */}
          <Route path="/dashboard" element={<RutaProtegida><DashboardTallerPage /></RutaProtegida>} />
          <Route path="/dashboard/tecnico" element={<RutaProtegida><DashboardTecnicoPage /></RutaProtegida>} />

          <Route path="/ordenes" element={<RutaProtegida><OrdenesPage /></RutaProtegida>} />
          <Route path="/ordenes/nueva" element={<RutaProtegida><NuevaOrdenPage /></RutaProtegida>} />
          <Route path="/ordenes/diagnostico" element={<RutaProtegida><DiagnosticoOrdenPage /></RutaProtegida>} />
          <Route path="/ordenes/evidencia" element={<RutaProtegida><EvidenciaOrdenPage /></RutaProtegida>} />
          <Route path="/ordenes/detalle/:id" element={<RutaProtegida><DetalleOrdenPage /></RutaProtegida>} />

          <Route path="/inventario" element={<RutaProtegida><InventarioDashboardPage /></RutaProtegida>} />
          <Route path="/inventario/nuevo" element={<RutaProtegida><RegistroRepuestosPage /></RutaProtegida>} />
          <Route path="/inventario/movimientos" element={<RutaProtegida><MovimientosInventarioPage /></RutaProtegida>} />

          <Route path="/soporte" element={<RutaProtegida><SoportePage /></RutaProtegida>} />

          {/* ---- Privadas restringidas por rol ---- */}
          <Route
            path="/tecnicos"
            element={<RutaProtegida roles={ROLES_ADMIN}><TecnicosPage /></RutaProtegida>}
          />
          <Route
            path="/configuracion"
            element={<RutaProtegida roles={ROLES_ADMIN}><ConfiguracionPage /></RutaProtegida>}
          />

          {/* Cualquier otra ruta vuelve a la landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
