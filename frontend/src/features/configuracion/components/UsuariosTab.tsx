import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, AlertTriangle } from 'lucide-react';
import type { ConfiguracionController } from '../useConfiguracion';
import type { UserRole } from '../../../api/types';

// Roles reales del sistema (enum RolUsuario en el backend).
const ROLES: { valor: UserRole; etiqueta: string }[] = [
  { valor: 'ADMIN', etiqueta: 'Administrador' },
  { valor: 'PROPIETARIO', etiqueta: 'Propietario' },
  { valor: 'TECNICO', etiqueta: 'Técnico' },
  { valor: 'RECEPCIONISTA', etiqueta: 'Recepcionista' },
];

const etiquetaRol = (rol: UserRole) => ROLES.find(r => r.valor === rol)?.etiqueta ?? rol;

export const UsuariosTab: React.FC<{ c: ConfiguracionController }> = ({ c }) => {
  const { usuarios, usuarioActual, isSaving, limiteUsuarios, crearUsuario, cambiarEstadoUsuario } = c;

  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<UserRole>('RECEPCIONISTA');

  const activos = usuarios.filter(u => u.activo).length;

  // El backend es quien decide; aquí solo se anticipa el bloqueo en la interfaz.
  const cupoLleno = limiteUsuarios ? !limiteUsuarios.cupoDisponible : false;
  const textoCupo = !limiteUsuarios
    ? `${activos} ${activos === 1 ? 'activo' : 'activos'}`
    : limiteUsuarios.ilimitado
      ? `${limiteUsuarios.usuariosActivos} activos · usuarios ilimitados`
      : `${limiteUsuarios.usuariosActivos} de ${limiteUsuarios.maxUsuarios} usuarios activos`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const creado = await crearUsuario({ nombre, apellido, correo, password, rol });
    if (creado) {
      setNombre('');
      setApellido('');
      setCorreo('');
      setPassword('');
      setShowForm(false);
    }
  };

  return (
    <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Usuarios del sistema
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
            {usuarios.length} {usuarios.length === 1 ? 'cuenta registrada' : 'cuentas registradas'} · {textoCupo}
            {limiteUsuarios?.nombrePlan && ` · Plan ${limiteUsuarios.nombrePlan}`}
          </p>
        </div>
        {!showForm && (
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            disabled={cupoLleno}
            title={cupoLleno ? 'Alcanzaste el límite de usuarios de tu plan' : undefined}
            onClick={() => setShowForm(true)}
          >
            Crear usuario
          </Button>
        )}
      </div>

      {cupoLleno && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '20px'
        }}>
          <AlertTriangle size={18} color="#B45309" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '13px', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
            Alcanzaste el límite de {limiteUsuarios?.maxUsuarios} usuarios activos
            {limiteUsuarios?.nombrePlan ? ` del plan ${limiteUsuarios.nombrePlan}` : ''}.
            Desactiva un usuario para liberar un cupo o cambia de plan en la pestaña Suscripción.
          </p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#F8FAFC',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Nuevo usuario del taller
            </h4>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
              Para técnicos, usa el módulo de Técnicos: ahí se crea el usuario junto con su perfil.
            </p>
          </div>
          <div className="grid-3">
            <Input label="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={50} required />
            <Input label="Apellido *" value={apellido} onChange={(e) => setApellido(e.target.value)} maxLength={50} required />
            <div className="input-group">
              <label className="input-label">Rol</label>
              <select value={rol} onChange={(e) => setRol(e.target.value as UserRole)} className="input-field">
                {ROLES.map(r => (
                  <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <Input
              label="Correo *"
              type="email"
              placeholder="usuario@taller.hn"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              maxLength={100}
              required
            />
            <Input
              label="Contraseña inicial *"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={100}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Creando...' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      )}

      <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAFAFD', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Nombre</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Correo</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Rol</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Último acceso</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
                  No se pudieron cargar los usuarios.
                </td>
              </tr>
            )}
            {usuarios.map((u) => {
              const esYo = usuarioActual?.id === u.id;
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#1E1B4B' }}>
                    {u.nombre} {u.apellido}
                    {esYo && (
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#3730A3', backgroundColor: '#EDE9FE', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>
                        TÚ
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B' }}>{u.correo}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      backgroundColor: u.rol === 'ADMIN' || u.rol === 'PROPIETARIO' ? '#EDE9FE' : '#F1F5F9',
                      color: u.rol === 'ADMIN' || u.rol === 'PROPIETARIO' ? '#3730A3' : '#475569'
                    }}>
                      {etiquetaRol(u.rol)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748B' }}>
                    {u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleString('es-HN') : 'Nunca'}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <button
                      onClick={() => cambiarEstadoUsuario(u)}
                      disabled={esYo}
                      title={esYo ? 'No puedes desactivar tu propia cuenta' : u.activo ? 'Clic para desactivar' : 'Clic para activar'}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: u.activo ? '#DCFCE7' : '#FEE2E2',
                        color: u.activo ? '#15803D' : '#B91C1C',
                        border: 'none',
                        cursor: esYo ? 'not-allowed' : 'pointer',
                        opacity: esYo ? 0.6 : 1
                      }}
                    >
                      {u.activo ? 'ACTIVO' : 'DESACTIVADO'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
