import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { X, Phone, Mail, IdCard, Lock } from 'lucide-react';
import { tecnicosService } from '../../../api/services/tecnicosService';
import { getApiErrorMessage } from '../../../api/apiError';
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

interface RegistroTecnicoDrawerProps {
  onClose: () => void;
  onRegistrado: (tecnico: TecnicoResponse) => void;
}

// Drawer lateral con el formulario de registro; maneja su propio estado y envío.
export const RegistroTecnicoDrawer: React.FC<RegistroTecnicoDrawerProps> = ({ onClose, onRegistrado }) => {
  const [form, setForm] = useState<TecnicoRegistroRequest>(FORM_INICIAL);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFormChange = (field: keyof TecnicoRegistroRequest, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
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
      onRegistrado(nuevoTecnico);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No se pudo registrar el técnico. Verifica los datos.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
            onClick={onClose}
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
            onClick={onClose}
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
  );
};
