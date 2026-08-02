import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Plus, Search, UserRound } from 'lucide-react';
import { tecnicosService } from '../../../api/services/tecnicosService';
import { RegistroTecnicoDrawer } from '../components/RegistroTecnicoDrawer';
import type { TecnicoResponse } from '../../../api/types';

export const TecnicosPage: React.FC = () => {
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTecnicos = async () => {
      try {
        const data = await tecnicosService.listar();
        if (isMounted) {
          setTecnicos(data);
          setLoadError('');
        }
      } catch {
        if (isMounted) {
          setLoadError('No se pudieron cargar los técnicos desde el backend.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTecnicos();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRegistrado = (nuevoTecnico: TecnicoResponse) => {
    setTecnicos(prev => [nuevoTecnico, ...prev]);
    setIsDrawerOpen(false);
    setSuccessMessage(`Técnico ${nuevoTecnico.nombre} ${nuevoTecnico.apellido} registrado correctamente.`);
  };

  const handleToggleEstado = async (tecnico: TecnicoResponse) => {
    const accion = tecnico.activo ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Está seguro de ${accion} al técnico ${tecnico.nombre} ${tecnico.apellido}?`)) {
      return;
    }

    try {
      const actualizado = await tecnicosService.cambiarEstado(tecnico.idTecnico, !tecnico.activo);
      setTecnicos(prev => prev.map(t => t.idTecnico === actualizado.idTecnico ? actualizado : t));
    } catch {
      setLoadError('No se pudo cambiar el estado del técnico.');
    }
  };

  const filteredTecnicos = tecnicos.filter(tec => {
    const term = searchTerm.toLowerCase();
    return `${tec.nombre} ${tec.apellido}`.toLowerCase().includes(term) ||
           tec.dni.toLowerCase().includes(term) ||
           tec.correo.toLowerCase().includes(term);
  });

  return (
    <DashboardLayout title="Técnicos" subtitle="">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>

        {/* Top Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{
            padding: '10px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            backgroundColor: '#EDE9FE',
            color: '#3730A3',
            border: 'none'
          }}>
            Lista de Técnicos
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: '#3730A3',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> Registrar Técnico
          </button>
        </div>

        {isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando técnicos desde el backend...
          </Card>
        )}

        {loadError && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {loadError}
          </Card>
        )}

        {successMessage && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#15803D', fontWeight: '700' }}>
            {successMessage}
          </Card>
        )}

        {/* Search Box */}
        <Card hoverable={false} style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <Input
              placeholder="Buscar por nombre, DNI o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
        </Card>

        {/* Tecnicos Table */}
        <Card hoverable={false} style={{ padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#EDE9FE', color: '#3730A3', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>TÉCNICO</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>DNI</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>TELÉFONO</th>
                <th style={{ padding: '16px 20px', fontWeight: '800' }}>CONTACTO EMERGENCIA</th>
                <th style={{ padding: '16px 20px', fontWeight: '800', textAlign: 'center' }}>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {filteredTecnicos.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: '#64748B', fontWeight: '600' }}>
                    No hay técnicos registrados todavía. Usa "Registrar Técnico" para agregar el primero.
                  </td>
                </tr>
              )}
              {filteredTecnicos.map((tec) => (
                <tr key={tec.idTecnico} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#EDE9FE',
                        color: '#3730A3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <UserRound size={18} />
                      </div>
                      <div>
                        <span style={{ fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                          {tec.nombre} {tec.apellido}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>{tec.correo}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: '700', color: '#475569' }}>
                    {tec.dni}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: '600', color: '#475569' }}>
                    {tec.telefono}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {tec.nombreContactoEmergencia ? (
                      <>
                        <span style={{ fontWeight: '700', color: '#1E293B', display: 'block' }}>{tec.nombreContactoEmergencia}</span>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>{tec.telefonoContactoEmergencia ?? 'Sin teléfono'}</span>
                      </>
                    ) : (
                      <span style={{ color: '#94A3B8' }}>No registrado</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleEstado(tec)}
                      title={tec.activo ? 'Clic para desactivar' : 'Clic para activar'}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        backgroundColor: tec.activo ? '#DCFCE7' : '#F1F5F9',
                        color: tec.activo ? '#15803D' : '#64748B',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {tec.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {isDrawerOpen && (
          <RegistroTecnicoDrawer
            onClose={() => setIsDrawerOpen(false)}
            onRegistrado={handleRegistrado}
          />
        )}

      </div>
    </DashboardLayout>
  );
};
