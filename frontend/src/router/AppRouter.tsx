import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Marketplace Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/buscar-talleres" element={<BuscarTalleresPage />} />
        <Route path="/taller/:id" element={<DetalleTallerPage />} />
        <Route path="/consultar-reparacion" element={<ConsultaReparacionPage />} />
        <Route path="/precios" element={<PreciosPage />} />

        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />

        {/* Admin / Taller Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardTallerPage />} />
        <Route path="/dashboard/tecnico" element={<DashboardTecnicoPage />} />

        {/* Ordenes Routes */}
        <Route path="/ordenes" element={<OrdenesPage />} />
        <Route path="/ordenes/nueva" element={<NuevaOrdenPage />} />
        <Route path="/ordenes/diagnostico" element={<DiagnosticoOrdenPage />} />
        <Route path="/ordenes/evidencia" element={<EvidenciaOrdenPage />} />
        <Route path="/ordenes/detalle/:id" element={<DetalleOrdenPage />} />

        {/* Tecnicos Routes */}
        <Route path="/tecnicos" element={<TecnicosPage />} />

        {/* Inventario Routes */}
        <Route path="/inventario" element={<InventarioDashboardPage />} />
        <Route path="/inventario/nuevo" element={<RegistroRepuestosPage />} />
        <Route path="/inventario/movimientos" element={<MovimientosInventarioPage />} />

        {/* Configuracion & Soporte Routes */}
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        <Route path="/soporte" element={<SoportePage />} />

        {/* Catch-all redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
