import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus } from 'lucide-react';
import { DatosEmpresaForm } from './DatosEmpresaForm';
import type { ConfiguracionController } from '../useConfiguracion';
import type { TipoCuenta } from '../../../api/types';

const TIPOS_CUENTA: TipoCuenta[] = ['AHORRO', 'CHEQUES', 'OTRO'];
const MONEDAS = ['HNL', 'USD'];

const ETIQUETA_TIPO: Record<TipoCuenta, string> = {
  AHORRO: 'Ahorro',
  CHEQUES: 'Cheques',
  OTRO: 'Otro',
};

export const EmpresaTab: React.FC<{ c: ConfiguracionController }> = ({ c }) => {
  const { empresa, cuentasPago, isSaving, guardarEmpresa, agregarCuentaPago, cambiarEstadoCuentaPago } = c;

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newBanco, setNewBanco] = useState('');
  const [newTipo, setNewTipo] = useState<TipoCuenta>('AHORRO');
  const [newNumero, setNewNumero] = useState('');
  const [newTitular, setNewTitular] = useState('');
  const [newMoneda, setNewMoneda] = useState('HNL');
  const [newInstrucciones, setNewInstrucciones] = useState('');

  const handleAddAccount = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const creada = await agregarCuentaPago({
      banco: newBanco,
      tipoCuenta: newTipo,
      numeroCuenta: newNumero,
      titular: newTitular,
      moneda: newMoneda,
      instrucciones: newInstrucciones,
    });
    if (creada) {
      setNewBanco('');
      setNewNumero('');
      setNewInstrucciones('');
      setShowAddAccount(false);
    }
  };

  if (!empresa) {
    return (
      <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF', color: '#94A3B8' }}>
        No se pudieron cargar los datos de la empresa.
      </Card>
    );
  }

  return (
    <>
      <DatosEmpresaForm empresa={empresa} isSaving={isSaving} onGuardar={guardarEmpresa} />

      {/* Cuentas bancarias del taller */}
      <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Cuentas bancarias del taller
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
              Cuentas donde tus clientes depositan o transfieren los pagos de sus reparaciones
            </p>
          </div>
          {!showAddAccount && (
            <Button
              variant="accent"
              icon={<Plus size={16} />}
              onClick={() => {
                setNewTitular(empresa.nombre);
                setShowAddAccount(true);
              }}
            >
              Agregar cuenta
            </Button>
          )}
        </div>

        {showAddAccount && (
          <form onSubmit={handleAddAccount} style={{
            backgroundColor: '#F8FAFC',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Nueva cuenta bancaria
            </h4>
            <div className="grid-3">
              <Input
                label="Banco *"
                placeholder="Ej. Banco Atlántida"
                value={newBanco}
                onChange={(e) => setNewBanco(e.target.value)}
                maxLength={100}
                required
              />
              <div className="input-group">
                <label className="input-label">Tipo de cuenta</label>
                <select value={newTipo} onChange={(e) => setNewTipo(e.target.value as TipoCuenta)} className="input-field">
                  {TIPOS_CUENTA.map(tipo => (
                    <option key={tipo} value={tipo}>{ETIQUETA_TIPO[tipo]}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Número de cuenta *"
                placeholder="Ej. 110-2394-8239"
                value={newNumero}
                onChange={(e) => setNewNumero(e.target.value)}
                maxLength={50}
                required
              />
            </div>
            <div className="grid-2">
              <Input
                label="Titular *"
                value={newTitular}
                onChange={(e) => setNewTitular(e.target.value)}
                maxLength={120}
                required
              />
              <div className="input-group">
                <label className="input-label">Moneda</label>
                <select value={newMoneda} onChange={(e) => setNewMoneda(e.target.value)} className="input-field">
                  {MONEDAS.map(moneda => (
                    <option key={moneda} value={moneda}>{moneda}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Instrucciones para el cliente"
              placeholder="Ej. Enviar el comprobante desde el seguimiento web"
              value={newInstrucciones}
              onChange={(e) => setNewInstrucciones(e.target.value)}
              maxLength={255}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <Button variant="ghost" type="button" onClick={() => setShowAddAccount(false)}>Cancelar</Button>
              <Button variant="primary" type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar cuenta'}
              </Button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cuentasPago.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '14px' }}>
              No hay cuentas bancarias registradas todavía.
            </div>
          ) : (
            cuentasPago.map((cuenta) => (
              <div key={cuenta.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid #F1F5F9',
                backgroundColor: '#FAFAFD',
                opacity: cuenta.activo ? 1 : 0.6
              }}>
                <div style={{ display: 'flex', gap: '32px', flex: 1, alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#EDE9FE',
                    color: '#3730A3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {cuenta.banco.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                      {cuenta.banco}
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EDE9FE', color: '#3730A3', marginLeft: '6px' }}>
                        {cuenta.moneda}
                      </span>
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                      {ETIQUETA_TIPO[cuenta.tipoCuenta]} · No. {cuenta.numeroCuenta}
                    </span>
                  </div>
                  <div style={{ marginLeft: 'auto', marginRight: '32px', textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block' }}>Titular</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>{cuenta.titular}</span>
                  </div>
                </div>
                <button
                  onClick={() => cambiarEstadoCuentaPago(cuenta)}
                  title={cuenta.activo ? 'Clic para desactivar' : 'Clic para activar'}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    backgroundColor: cuenta.activo ? '#DCFCE7' : '#F1F5F9',
                    color: cuenta.activo ? '#15803D' : '#64748B',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {cuenta.activo ? 'Activa' : 'Inactiva'}
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
};
