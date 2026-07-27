import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Plus, Search, X, UserRound, Phone, Mail, IdCard, Lock } from 'lucide-react';
import { tecnicosService } from '../../../api/services/tecnicosService';
import type { TecnicoRegistroRequest, TecnicoResponse } from '../../../api/types';

const FORM_INICIAL: TecnicoRegistroRequest = {
  nombre: '',
  apellido: '',
  correo: '',
  password: '',
  dni: '',
  rtn: '',
  direccion: '',
  telefono: '',
  fechaNacimiento: '',
  nombreContactoEmergencia: '',
  telefonoContactoEmergencia: '',
};

export const TecnicosPage: React.FC = () => {
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState<TecnicoRegistroRequest>(FORM_INICIAL);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTecnicos = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const data = await tecnicosService.listar();
        if (isMounted) {
          setTecnicos(data);
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

  const handleFormChange = (field: keyof TecnicoRegistroRequest, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const payload: TecnicoRegistroRequest = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        password: form.password,
        dni: form.dni.trim(),
        telefono: form.telefono.trim(),
        rtn: form.rtn?.trim() || undefined,
        direccion: form.direccion?.trim() || undefined,
        fechaNacimiento: form.fechaNacimiento || undefined,
        nombreContactoEmergencia: form.nombreContactoEmergencia?.trim() || undefined,
        telefonoContactoEmergencia: form.telefonoContactoEmergencia?.trim() || undefined,
      };

      const nuevoTecnico = await tecnicosService.registrar(payload);
      setTecnicos(prev => [nuevoTecnico, ...prev]);
      setForm(FORM_INICIAL);
      setIsDrawerOpen(false);
      setSuccessMessage(`Técnico ${nuevoTecnico.nombre} ${nuevoTecnico.apellido} registrado correctamente.`);
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message ?? 'No se pudo registrar el técnico. Verifica los datos.');
    } finally {
      setIsSaving(false);
    }
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
    <DashboardLayout title="Técnicos" subtitle="" role="admin">
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
            onClick={() => {
              setFormError('');
              setIsDrawerOpen(true);
            }}
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

        {/* RIGHT SLIDING DRAWER - Registro de Técnico */}
        {isDrawerOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <form
              onSubmit={handleSubmit}
              style={{
                width: '460px',
                height: '100%',
                backgroundColor: '#FFFFFF',
                boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
                padding: '32px 24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#3730A3',
                    backgroundColor: '#EDE9FE',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    NUEVO TÉCNICO
                  </span>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    Registrar Técnico
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Se creará su usuario con rol TECNICO y su perfil en un solo paso.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={24} />
                </button>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: 0 }} />

              {formError && (
                <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700', fontSize: '13px' }}>
                  {formError}
                </div>
              )}

              {/* Datos de acceso */}
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B' }}>DATOS DE ACCESO</span>

              <div className="grid-2">
                <Input
                  label="Nombre *"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => handleFormChange('nombre', e.target.value)}
                  maxLength={50}
                  required
                />
                <Input
                  label="Apellido *"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={(e) => handleFormChange('apellido', e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              <Input
                label="Correo *"
                type="email"
                placeholder="tecnico@taller.hn"
                value={form.correo}
                onChange={(e) => handleFormChange('correo', e.target.value)}
                icon={<Mail size={16} />}
                maxLength={100}
                required
              />

              <Input
                label="Contraseña inicial *"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                icon={<Lock size={16} />}
                minLength={8}
                maxLength={100}
                required
              />

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: 0 }} />

              {/* Datos personales */}
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B' }}>DATOS PERSONALES</span>

              <div className="grid-2">
                <Input
                  label="DNI *"
                  placeholder="0801-1990-12345"
                  value={form.dni}
                  onChange={(e) => handleFormChange('dni', e.target.value)}
                  icon={<IdCard size={16} />}
                  maxLength={20}
                  required
                />
                <Input
                  label="RTN"
                  placeholder="Opcional"
                  value={form.rtn}
                  onChange={(e) => handleFormChange('rtn', e.target.value)}
                  maxLength={20}
                />
              </div>

              <div className="grid-2">
                <Input
                  label="Teléfono *"
                  placeholder="+504 9999-9999"
                  value={form.telefono}
                  onChange={(e) => handleFormChange('telefono', e.target.value)}
                  icon={<Phone size={16} />}
                  maxLength={20}
                  required
                />
                <Input
                  label="Fecha de nacimiento"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) => handleFormChange('fechaNacimiento', e.target.value)}
                />
              </div>

              <Input
                label="Dirección"
                placeholder="Colonia, calle, ciudad (opcional)"
                value={form.direccion}
                onChange={(e) => handleFormChange('direccion', e.target.value)}
                maxLength={255}
              />

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: 0 }} />

              {/* Contacto de emergencia */}
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#1E1B4B' }}>CONTACTO DE EMERGENCIA</span>

              <div className="grid-2">
                <Input
                  label="Nombre"
                  placeholder="Opcional"
                  value={form.nombreContactoEmergencia}
                  onChange={(e) => handleFormChange('nombreContactoEmergencia', e.target.value)}
                  maxLength={100}
                />
                <Input
                  label="Teléfono"
                  placeholder="Opcional"
                  value={form.telefonoContactoEmergencia}
                  onChange={(e) => handleFormChange('telefonoContactoEmergencia', e.target.value)}
                  maxLength={20}
                />
              </div>

              {/* Bottom Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    backgroundColor: '#FFFFFF',
                    color: '#3730A3',
                    border: '1.5px solid #3730A3',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    backgroundColor: isSaving ? '#A5B4FC' : '#3730A3',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: isSaving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSaving ? 'Registrando...' : 'Registrar Técnico'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
