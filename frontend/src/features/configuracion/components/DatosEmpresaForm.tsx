import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Check, Building2 } from 'lucide-react';
import type { EmpresaResponse } from '../../../api/types';

interface DatosEmpresaFormProps {
  empresa: EmpresaResponse;
  isSaving: boolean;
  onGuardar: (datos: {
    nombre: string;
    rtn: string;
    telefono: string;
    correo: string;
    direccion: string;
  }) => void;
}

// Se monta con los datos ya cargados del backend, así que el estado inicial
// del formulario sale directamente de la empresa (sin efectos de sincronización).
export const DatosEmpresaForm: React.FC<DatosEmpresaFormProps> = ({ empresa, isSaving, onGuardar }) => {
  const [nombre, setNombre] = useState(empresa.nombre);
  const [rtn, setRtn] = useState(empresa.rtn ?? '');
  const [telefono, setTelefono] = useState(empresa.telefono ?? '');
  const [correo, setCorreo] = useState(empresa.correo);
  const [direccion, setDireccion] = useState(empresa.direccion ?? '');

  const descartarCambios = () => {
    setNombre(empresa.nombre);
    setRtn(empresa.rtn ?? '');
    setTelefono(empresa.telefono ?? '');
    setCorreo(empresa.correo);
    setDireccion(empresa.direccion ?? '');
  };

  return (
    <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
          Datos de la empresa
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
          Información usada en cotizaciones y comprobantes
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>

        {/* Identidad de la empresa */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '140px', flexShrink: 0 }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            backgroundColor: '#EDE9FE',
            color: '#3730A3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <Building2 size={32} />
            <span style={{ fontSize: '26px', fontWeight: '800' }}>
              {empresa.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: empresa.activo ? '#DCFCE7' : '#FEE2E2',
            color: empresa.activo ? '#15803D' : '#B91C1C'
          }}>
            {empresa.activo ? 'ACTIVA' : 'INACTIVA'}
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
            Registrada el {new Date(empresa.fechaRegistro).toLocaleDateString('es-HN')}
          </span>
        </div>

        {/* Campos editables */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-2">
            <Input label="Razón social" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} />
            <Input label="RTN" value={rtn} onChange={(e) => setRtn(e.target.value)} placeholder="Opcional" maxLength={20} />
          </div>
          <div className="grid-2">
            <Input label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} maxLength={20} />
            <Input label="Correo electrónico" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} maxLength={100} />
          </div>
          <Input label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} maxLength={255} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
        <Button variant="outline" disabled={isSaving} onClick={descartarCambios}>
          Descartar cambios
        </Button>
        <Button
          variant="primary"
          icon={<Check size={16} />}
          disabled={isSaving}
          onClick={() => onGuardar({ nombre, rtn, telefono, correo, direccion })}
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </Card>
  );
};
