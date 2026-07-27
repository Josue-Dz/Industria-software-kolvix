import React, { useState, useRef } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  MessageSquare, 
  Mail, 
  Layers, 
  FileText, 
  CreditCard,
  Camera,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  PlusCircle,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface BankAccount {
  id: string;
  banco: string;
  tipo: string;
  numero: string;
  titular: string;
  moneda: string;
}

interface UserItem {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: 'ACTIVO' | 'INVITACIÓN PENDIENTE' | 'DESACTIVADO';
}

interface CustomState {
  id: string;
  nombre: string;
  color: string;
}

export const ConfiguracionPage: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('empresa');

  // Success Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- Empresa Tab States ---
  const [razonSocial, setRazonSocial] = useState('TallerOS Service Center');
  const [rtn, setRtn] = useState('0801-1985-001122');
  const [telefono, setTelefono] = useState('+504 9988-7766');
  const [correoEmpresa, setCorreoEmpresa] = useState('contacto@talleros.mx');
  const [direccion, setDireccion] = useState('Barrio El Centro, 3 Avenida, San Pedro Sula, Honduras');
  const [zonaHoraria, setZonaHoraria] = useState('America/Tegucigalpa');
  const [logoUrl, setLogoUrl] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
          showToast('Logotipo actualizado localmente');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Cuentas Bancarias State ---
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: '1', banco: 'Banco Atlántida', tipo: 'Ahorro', numero: '110-2394-8239', titular: 'TallerOS Service Center', moneda: 'HNL' },
    { id: '2', banco: 'BAC Credomatic', tipo: 'Cheques', numero: '7482-1928-3728', titular: 'TallerOS Service Center', moneda: 'USD' }
  ]);

  const [newBanco, setNewBanco] = useState('');
  const [newTipo, setNewTipo] = useState('Ahorro');
  const [newNumero, setNewNumero] = useState('');
  const [newTitular, setNewTitular] = useState('TallerOS Service Center');
  const [newMoneda, setNewMoneda] = useState('HNL');
  const [showAddAccount, setShowAddAccount] = useState(false);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanco || !newNumero) {
      showToast('Por favor complete el nombre del banco y el número de cuenta');
      return;
    }
    const newAcc: BankAccount = {
      id: Date.now().toString(),
      banco: newBanco,
      tipo: newTipo,
      numero: newNumero,
      titular: newTitular,
      moneda: newMoneda
    };
    setBankAccounts([...bankAccounts, newAcc]);
    setNewBanco('');
    setNewNumero('');
    setShowAddAccount(false);
    showToast('Cuenta bancaria agregada exitosamente');
  };

  const handleDeleteAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
    showToast('Cuenta bancaria eliminada');
  };

  // --- Usuarios Tab States ---
  const [users, setUsers] = useState<UserItem[]>([
    { id: '1', nombre: 'Mario Reyes', correo: 'admin@talleros.mx', rol: 'Administrador', estado: 'ACTIVO' },
    { id: '2', nombre: 'Luis Soto', correo: 'l.soto@talleros.mx', rol: 'Técnico', estado: 'ACTIVO' },
    { id: '3', nombre: 'Julia Pérez', correo: 'j.perez@talleros.mx', rol: 'Técnico', estado: 'ACTIVO' },
    { id: '4', nombre: 'María Cruz', correo: 'm.cruz@talleros.mx', rol: 'QA', estado: 'ACTIVO' },
    { id: '5', nombre: 'Ana López', correo: 'a.lopez@talleros.mx', rol: 'Recepción', estado: 'INVITACIÓN PENDIENTE' }
  ]);

  const [inviteNombre, setInviteNombre] = useState('');
  const [inviteCorreo, setInviteCorreo] = useState('');
  const [inviteRol, setInviteRol] = useState('Técnico');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteNombre || !inviteCorreo) {
      showToast('Por favor ingrese el nombre y correo');
      return;
    }
    const newUser: UserItem = {
      id: Date.now().toString(),
      nombre: inviteNombre,
      correo: inviteCorreo,
      rol: inviteRol,
      estado: 'INVITACIÓN PENDIENTE'
    };
    setUsers([...users, newUser]);
    setInviteNombre('');
    setInviteCorreo('');
    setShowInviteModal(false);
    showToast(`Invitación enviada a ${inviteCorreo}`);
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.estado === 'ACTIVO' ? 'DESACTIVADO' : 'ACTIVO';
        return { ...u, estado: newStatus };
      }
      return u;
    }));
    showToast('Estado del usuario actualizado');
  };

  // --- WhatsApp Tab States ---
  const [wsToken, setWsToken] = useState('d8f8a9s8f09as8df0as9d8f90asdf');
  const [wsPhone, setWsPhone] = useState('+504 9988-7766');
  const [wsTemplateCot, setWsTemplateCot] = useState('cotizacion_taller_v3');
  const [wsTemplateNotif, setWsTemplateNotif] = useState('estado_orden_v2');

  // --- Correo Tab States ---
  const [smtpHost, setSmtpHost] = useState('smtp.mailtrap.io');
  const [smtpPort, setSmtpPort] = useState('2525');
  const [smtpUser, setSmtpUser] = useState('taller_central_user');
  const [smtpPass, setSmtpPass] = useState('••••••••••••••••');

  // --- Facturación Tab States ---
  const [razonFiscal, setRazonFiscal] = useState('TallerOS S.A. de C.V.');
  const [rfc, setRfc] = useState('TOS220115R7A');
  const [regimenFiscal, setRegimenFiscal] = useState('601 - General Personas Morales');
  const [domicilioFiscal, setDomicilioFiscal] = useState('Av. Reforma 145, CDMX, 06030');
  const [serieCot, setSerieCot] = useState('COT-');
  const [serieOrd, setSerieOrd] = useState('OR-');
  const [folioActual, setFolioActual] = useState('2042');

  // --- Estados personalizados Tab States ---
  const [states, setStates] = useState<CustomState[]>([
    { id: '1', nombre: 'Recepción', color: '#94A3B8' },
    { id: '2', nombre: 'Diagnóstico', color: '#0EA5E9' },
    { id: '3', nombre: 'Cotización', color: '#F59E0B' },
    { id: '4', nombre: 'Aprobado', color: '#22C55E' },
    { id: '5', nombre: 'En reparación', color: '#6366F1' },
    { id: '6', nombre: 'Control de calidad', color: '#8B5CF6' },
    { id: '7', nombre: 'Listo para entrega', color: '#10B981' },
    { id: '8', nombre: 'Entregado', color: '#16A34A' }
  ]);
  const [newStateNombre, setNewStateNombre] = useState('');
  const [newStateColor, setNewStateColor] = useState('#6366F1');

  const handleAddState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStateNombre) return;
    const newState: CustomState = {
      id: Date.now().toString(),
      nombre: newStateNombre,
      color: newStateColor
    };
    setStates([...states, newState]);
    setNewStateNombre('');
    showToast(`Estado "${newStateNombre}" agregado`);
  };

  const handleDeleteState = (id: string) => {
    setStates(states.filter(s => s.id !== id));
    showToast('Estado eliminado');
  };

  // --- Suscripción SaaS States ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<string | null>(null);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Comprobante de pago subido. Esperando validación del administrador.');
    setShowPaymentModal(false);
    setPaymentReceipt('comprobante_cargado.pdf');
  };

  // Nav Items Config
  const innerNavItems = [
    { id: 'empresa', label: 'Empresa', icon: Building2 },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'roles', label: 'Roles y permisos', icon: ShieldAlert },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'correo', label: 'Correo', icon: Mail },
    { id: 'estados', label: 'Estados personalizados', icon: Layers },
    { id: 'facturacion', label: 'Facturación', icon: FileText },
    { id: 'suscripcion', label: 'Suscripción SaaS', icon: CreditCard }
  ];

  return (
    <DashboardLayout
      title="Configuración"
      subtitle="Preferencias del sistema · Mario Reyes · Admin · Hoy"
      role="admin"
    >
      {/* Dynamic Toast Success Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '32px',
          backgroundColor: '#1E1B4B',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(30, 27, 75, 0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.3s ease',
          fontSize: '14px',
          fontWeight: '600',
          borderLeft: '4px solid #6366F1'
        }}>
          <Check size={18} color="#A78BFA" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Navigation title and sub-header */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Configuración
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
            Personaliza tu instancia de TallerOS
          </p>
        </div>

        {/* Layout split: Inner Menu Sidebar (left) and Cards (right) */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* Inner Sidebar Menu */}
          <Card hoverable={false} style={{
            width: '280px',
            flexShrink: 0,
            padding: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {innerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '600',
                    backgroundColor: isActive ? '#F4F0FF' : 'transparent',
                    color: isActive ? '#3730A3' : '#64748B',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#6366F1' : '#94A3B8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </Card>

          {/* Right Panel Content */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 1. EMPRESA TAB */}
            {activeTab === 'empresa' && (
              <>
                <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                        Datos de la empresa
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                        Información usada en cotizaciones y comprobantes
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
                    
                    {/* Logo Changer */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B' }}>Logotipo</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '24px',
                          border: '2px dashed #CBD5E1',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#F8FAFC',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <img src={logoUrl} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          bottom: 0, right: 0, left: 0,
                          backgroundColor: 'rgba(30, 27, 75, 0.65)',
                          color: '#FFFFFF',
                          padding: '6px 0',
                          textAlign: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Camera size={14} />
                          <span style={{ fontSize: '10px', fontWeight: '700' }}>CAMBIAR</span>
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleLogoChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                      />
                    </div>

                    {/* Profile Fields form */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="grid-2">
                        <Input 
                          label="Razón social" 
                          value={razonSocial} 
                          onChange={(e) => setRazonSocial(e.target.value)} 
                        />
                        <Input 
                          label="RTN / RFC" 
                          value={rtn} 
                          onChange={(e) => setRtn(e.target.value)} 
                        />
                      </div>
                      <div className="grid-2">
                        <Input 
                          label="Teléfono" 
                          value={telefono} 
                          onChange={(e) => setTelefono(e.target.value)} 
                        />
                        <Input 
                          label="Correo electrónico" 
                          value={correoEmpresa} 
                          onChange={(e) => setCorreoEmpresa(e.target.value)} 
                        />
                      </div>
                      <div className="grid-2">
                        <Input 
                          label="Dirección" 
                          value={direccion} 
                          onChange={(e) => setDireccion(e.target.value)} 
                        />
                        <div className="input-group">
                          <label className="input-label">Zona horaria</label>
                          <select 
                            value={zonaHoraria}
                            onChange={(e) => setZonaHoraria(e.target.value)}
                            className="input-field"
                          >
                            <option value="America/Mexico_City">America/Mexico_City</option>
                            <option value="America/Tegucigalpa">America/Tegucigalpa</option>
                            <option value="America/Bogota">America/Bogota</option>
                            <option value="America/New_York">America/New_York</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
                    <Button variant="outline" onClick={() => showToast('Edición cancelada')}>Cancelar</Button>
                    <Button variant="primary" icon={<Check size={16} />} onClick={() => showToast('Cambios guardados exitosamente')}>Guardar cambios</Button>
                  </div>
                </Card>

                {/* Bank Accounts Sub-Section (Requested by User) */}
                <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                        Cuentas bancarias del taller
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                        Configura las cuentas donde los clientes pueden depositar o transferir pagos
                      </p>
                    </div>
                    {!showAddAccount && (
                      <Button variant="accent" icon={<Plus size={16} />} onClick={() => setShowAddAccount(true)}>
                        Agregar cuenta
                      </Button>
                    )}
                  </div>

                  {/* Add Account Inline Form */}
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
                          label="Banco" 
                          placeholder="Ej. Banco Atlántida" 
                          value={newBanco} 
                          onChange={(e) => setNewBanco(e.target.value)} 
                        />
                        <div className="input-group">
                          <label className="input-label">Tipo de cuenta</label>
                          <select 
                            value={newTipo} 
                            onChange={(e) => setNewTipo(e.target.value)}
                            className="input-field"
                          >
                            <option value="Ahorro">Ahorro</option>
                            <option value="Cheques">Cheques</option>
                            <option value="Corriente">Corriente</option>
                          </select>
                        </div>
                        <Input 
                          label="Número de cuenta" 
                          placeholder="Ej. 110-2394-8239" 
                          value={newNumero} 
                          onChange={(e) => setNewNumero(e.target.value)} 
                        />
                      </div>
                      <div className="grid-2">
                        <Input 
                          label="Titular" 
                          value={newTitular} 
                          onChange={(e) => setNewTitular(e.target.value)} 
                        />
                        <div className="input-group">
                          <label className="input-label">Moneda</label>
                          <select 
                            value={newMoneda} 
                            onChange={(e) => setNewMoneda(e.target.value)}
                            className="input-field"
                          >
                            <option value="HNL">Lempiras (HNL)</option>
                            <option value="USD">Dólares (USD)</option>
                            <option value="MXN">Pesos (MXN)</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <Button variant="ghost" type="button" onClick={() => setShowAddAccount(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar cuenta</Button>
                      </div>
                    </form>
                  )}

                  {/* List of Accounts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bankAccounts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '14px' }}>
                        No hay cuentas bancarias registradas.
                      </div>
                    ) : (
                      bankAccounts.map((account) => (
                        <div key={account.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          border: '1px solid #F1F5F9',
                          backgroundColor: '#FAFAFD'
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
                              fontSize: '18px'
                            }}>
                              {account.banco[0]}
                            </div>
                            <div>
                              <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                                {account.banco} <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EDE9FE', color: '#3730A3', marginLeft: '6px' }}>{account.moneda}</span>
                              </span>
                              <span style={{ fontSize: '13px', color: '#64748B' }}>
                                {account.tipo} · No. {account.numero}
                              </span>
                            </div>
                            <div style={{ marginLeft: 'auto', marginRight: '32px', textAlign: 'right' }}>
                              <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block' }}>Titular</span>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>{account.titular}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteAccount(account.id)}
                            style={{
                              color: '#EF4444',
                              padding: '8px',
                              borderRadius: '8px',
                              transition: 'background-color 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Eliminar cuenta"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </>
            )}

            {/* 2. USUARIOS TAB */}
            {activeTab === 'usuarios' && (
              <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                
                {/* Limit Progress Bar */}
                <div style={{
                  backgroundColor: '#FAFAFD',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Límite del Plan · Pro Taller</span>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B' }}>{users.length} / 10 usuarios activos</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(users.length / 10) * 100}%`, height: '100%', backgroundColor: '#6366F1', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => showToast('Redireccionando a planes de suscripción')}>Solicitar más usuarios</Button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Usuarios del sistema
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Gestión de cuentas y accesos
                    </p>
                  </div>
                  {!showInviteModal && (
                    <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowInviteModal(true)}>
                      Invitar usuario
                    </Button>
                  )}
                </div>

                {/* Invite User Form */}
                {showInviteModal && (
                  <form onSubmit={handleInviteUser} style={{
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
                      Invitar nuevo usuario al taller
                    </h4>
                    <div className="grid-3">
                      <Input 
                        label="Nombre completo" 
                        placeholder="Ej. Ana López" 
                        value={inviteNombre} 
                        onChange={(e) => setInviteNombre(e.target.value)} 
                      />
                      <Input 
                        label="Correo electrónico" 
                        placeholder="Ej. ana.lopez@talleros.mx" 
                        type="email"
                        value={inviteCorreo} 
                        onChange={(e) => setInviteCorreo(e.target.value)} 
                      />
                      <div className="input-group">
                        <label className="input-label">Rol</label>
                        <select 
                          value={inviteRol} 
                          onChange={(e) => setInviteRol(e.target.value)}
                          className="input-field"
                        >
                          <option value="Administrador">Administrador</option>
                          <option value="Técnico">Técnico</option>
                          <option value="Recepción">Recepción</option>
                          <option value="QA">QA</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <Button variant="ghost" type="button" onClick={() => setShowInviteModal(false)}>Cancelar</Button>
                      <Button variant="primary" type="submit">Enviar invitación</Button>
                    </div>
                  </form>
                )}

                {/* Table list of Users */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAFAFD', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Nombre</th>
                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Correo</th>
                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Rol</th>
                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Estado</th>
                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s' }}>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#1E1B4B' }}>{u.nombre}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B' }}>{u.correo}</td>
                          <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: '600',
                              backgroundColor: u.rol === 'Administrador' ? '#EDE9FE' : '#F1F5F9',
                              color: u.rol === 'Administrador' ? '#3730A3' : '#475569'
                            }}>{u.rol}</span>
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '12px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontWeight: '700',
                              backgroundColor: u.estado === 'ACTIVO' ? '#DCFCE7' : u.estado === 'DESACTIVADO' ? '#FEE2E2' : '#FEF3C7',
                              color: u.estado === 'ACTIVO' ? '#15803D' : u.estado === 'DESACTIVADO' ? '#B91C1C' : '#D97706'
                            }}>{u.estado}</span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {u.estado === 'INVITACIÓN PENDIENTE' ? (
                              <Button variant="ghost" size="sm" onClick={() => showToast(`Reenviando correo a ${u.correo}`)}>Reenviar</Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                style={{ color: u.estado === 'ACTIVO' ? '#EF4444' : '#10B981' }} 
                                onClick={() => handleToggleUserStatus(u.id)}
                              >
                                {u.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* 3. ROLES Y PERMISOS TAB */}
            {activeTab === 'roles' && (
              <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                <div style={{
                  backgroundColor: '#F4F0FF',
                  border: '1px solid #EDE9FE',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <ShieldAlert size={20} color="#3730A3" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3', margin: 0 }}>Roles definidos por TallerOS</h4>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      Los roles del sistema son fijos y no pueden modificarse. Cada rol incluye las capacidades necesarias para su función dentro del flujo operativo.
                    </p>
                  </div>
                </div>

                <div className="grid-2">
                  
                  {/* Card Admin */}
                  <Card hoverable={false} style={{ border: '1px solid #E2E8F0', padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', color: '#3730A3', justifyContent: 'center' }}>
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Administrador</h4>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Acceso total a la administración</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Capacidades</span>
                      {['Gestionar usuarios y accesos', 'Configurar empresa, planes y facturación', 'Aprobar solicitudes de compra y revisiones', 'Ver reportes e indicadores operativos', 'Cerrar y reabrir órdenes'].map((cap, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <Check size={14} color="#10B981" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Card Recepcion */}
                  <Card hoverable={false} style={{ border: '1px solid #E2E8F0', padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', color: '#0369A1', justifyContent: 'center' }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Recepción</h4>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Atención al cliente e ingresos</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Capacidades</span>
                      {['Crear órdenes de servicio', 'Registrar datos del cliente y del equipo', 'Capturar evidencia fotográfica de ingreso', 'Asignar la orden a un técnico disponible', 'Confirmar entrega final al cliente'].map((cap, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <Check size={14} color="#10B981" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Card Tecnico */}
                  <Card hoverable={false} style={{ border: '1px solid #E2E8F0', padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', color: '#D97706', justifyContent: 'center' }}>
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Técnico</h4>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Diagnóstico y reparaciones</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Capacidades</span>
                      {['Ver órdenes asignadas a su cola', 'Registrar diagnóstico técnico', 'Seleccionar repuestos desde inventario', 'Solicitar compra cuando no hay stock', 'Documentar el proceso de reparación con fotos'].map((cap, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <Check size={14} color="#10B981" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Card QA */}
                  <Card hoverable={false} style={{ border: '1px solid #E2E8F0', padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', color: '#15803D', justifyContent: 'center' }}>
                        <Check size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>QA</h4>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Control de calidad final</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Capacidades</span>
                      {['Revisar órdenes en cola de QA', 'Ejecutar checklist de validación final', 'Aprobar el equipo para entrega', 'Devolver la orden a reparación si encuentra fallas'].map((cap, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <Check size={14} color="#10B981" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                </div>
              </Card>
            )}

            {/* 4. WHATSAPP TAB */}
            {activeTab === 'whatsapp' && (
              <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Integración con WhatsApp Business
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Envía cotizaciones y notificaciones automáticas
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#E8F5E9',
                  border: '1px solid #C8E6C9',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  color: '#2E7D32',
                  fontSize: '14px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px'
                }}>
                  <Check size={18} />
                  <span>Conectado a {wsPhone}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <div className="grid-2">
                    <Input 
                      label="Token de API" 
                      type="password" 
                      value={wsToken} 
                      onChange={(e) => setWsToken(e.target.value)} 
                    />
                    <Input 
                      label="Número de teléfono de WhatsApp" 
                      value={wsPhone} 
                      onChange={(e) => setWsPhone(e.target.value)} 
                    />
                  </div>
                  <div className="grid-2">
                    <Input 
                      label="Plantilla de cotización" 
                      value={wsTemplateCot} 
                      onChange={(e) => setWsTemplateCot(e.target.value)} 
                    />
                    <Input 
                      label="Plantilla de notificación" 
                      value={wsTemplateNotif} 
                      onChange={(e) => setWsTemplateNotif(e.target.value)} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
                  <Button variant="outline" onClick={() => showToast('Probando conexión con Meta API...')}>Probar conexión</Button>
                  <Button variant="primary" onClick={() => showToast('Integración de WhatsApp guardada')}>Guardar configuración</Button>
                </div>
              </Card>
            )}

            {/* 5. CORREO TAB */}
            {activeTab === 'correo' && (
              <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    Configuración de Correo SMTP
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Define las credenciales SMTP para enviar correos automáticos del taller
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '24px 0 28px 0' }}>
                  <div className="grid-2">
                    <Input 
                      label="Host SMTP" 
                      value={smtpHost} 
                      onChange={(e) => setSmtpHost(e.target.value)} 
                    />
                    <Input 
                      label="Puerto SMTP" 
                      value={smtpPort} 
                      onChange={(e) => setSmtpPort(e.target.value)} 
                    />
                  </div>
                  <div className="grid-2">
                    <Input 
                      label="Usuario" 
                      value={smtpUser} 
                      onChange={(e) => setSmtpUser(e.target.value)} 
                    />
                    <Input 
                      label="Contraseña" 
                      type="password"
                      value={smtpPass} 
                      onChange={(e) => setSmtpPass(e.target.value)} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
                  <Button variant="outline" onClick={() => showToast('Enviando correo de prueba a admin@talleros.mx...')}>Probar envío</Button>
                  <Button variant="primary" onClick={() => showToast('Credenciales SMTP guardadas')}>Guardar servidor</Button>
                </div>
              </Card>
            )}

            {/* 6. ESTADOS PERSONALIZADOS TAB */}
            {activeTab === 'estados' && (
              <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Estados personalizados del flujo
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Arrastra para reordenar o crea nuevos estados
                    </p>
                  </div>
                </div>

                {/* Add new state form */}
                <form onSubmit={handleAddState} style={{
                  backgroundColor: '#FAFAFD',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-end',
                  marginBottom: '24px'
                }}>
                  <div style={{ flex: 1 }}>
                    <Input 
                      label="Nombre del estado" 
                      placeholder="Ej. Esperando repuesto" 
                      value={newStateNombre} 
                      onChange={(e) => setNewStateNombre(e.target.value)} 
                    />
                  </div>
                  <div className="input-group" style={{ width: '120px' }}>
                    <label className="input-label">Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={newStateColor} 
                        onChange={(e) => setNewStateColor(e.target.value)} 
                        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }} 
                      />
                      <span style={{ fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase' }}>{newStateColor}</span>
                    </div>
                  </div>
                  <Button variant="primary" type="submit" icon={<Plus size={16} />}>Nuevo estado</Button>
                </form>

                {/* States List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {states.map((st, idx) => (
                    <div key={st.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#94A3B8', width: '20px' }}>{idx + 1}</span>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: st.color }} />
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>{st.nombre}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace', textTransform: 'uppercase' }}>{st.color}</span>
                        <button 
                          onClick={() => showToast(`Editando estado: ${st.nombre}`)}
                          style={{ fontSize: '13px', fontWeight: '600', color: '#3730A3' }}
                        >
                          Editar
                        </button>
                        {states.length > 3 && (
                          <button 
                            onClick={() => handleDeleteState(st.id)}
                            style={{ color: '#EF4444', display: 'flex', alignItems: 'center' }}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 7. FACTURACIÓN TAB */}
            {activeTab === 'facturacion' && (
              <>
                <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Datos fiscales
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Información para la emisión de facturas
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                    <div className="grid-2">
                      <Input 
                        label="Razón social fiscal" 
                        value={razonFiscal} 
                        onChange={(e) => setRazonFiscal(e.target.value)} 
                      />
                      <Input 
                        label="RFC / RTN Fiscal" 
                        value={rfc} 
                        onChange={(e) => setRfc(e.target.value)} 
                      />
                    </div>
                    <div className="grid-2">
                      <Input 
                        label="Régimen fiscal" 
                        value={regimenFiscal} 
                        onChange={(e) => setRegimenFiscal(e.target.value)} 
                      />
                      <Input 
                        label="Domicilio fiscal" 
                        value={domicilioFiscal} 
                        onChange={(e) => setDomicilioFiscal(e.target.value)} 
                      />
                    </div>
                  </div>
                </Card>

                <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Series y folios
                    </h3>
                  </div>
                  <div className="grid-3" style={{ marginTop: '24px' }}>
                    <Input 
                      label="Serie cotizaciones" 
                      value={serieCot} 
                      onChange={(e) => setSerieCot(e.target.value)} 
                    />
                    <Input 
                      label="Serie órdenes" 
                      value={serieOrd} 
                      onChange={(e) => setSerieOrd(e.target.value)} 
                    />
                    <Input 
                      label="Folio actual" 
                      value={folioActual} 
                      onChange={(e) => setFolioActual(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '24px', marginTop: '24px' }}>
                    <Button variant="outline" onClick={() => showToast('Edición cancelada')}>Cancelar</Button>
                    <Button variant="primary" onClick={() => showToast('Configuración fiscal guardada')}>Guardar folios</Button>
                  </div>
                </Card>
              </>
            )}

            {/* 8. SUSCRIPCIÓN SAAS TAB */}
            {activeTab === 'suscripcion' && (
              <>
                {/* Plan Banner */}
                <Card hoverable={false} style={{
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
                  color: '#FFFFFF',
                  padding: '32px',
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px', right: '-20px',
                    width: '120px', height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    filter: 'blur(10px)'
                  }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 2 }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#A78BFA' }}>PLAN ACTUAL</span>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      Pro Taller <Sparkles size={20} color="#FBBF24" />
                    </h3>
                    <p style={{ fontSize: '14px', color: '#CBD5E1', margin: 0 }}>Hasta 10 usuarios · órdenes ilimitadas</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#10B981', color: '#FFFFFF' }}>ACTIVO</span>
                      <span style={{ fontSize: '13px', color: '#A78BFA' }}>Próxima renovación · 01 Jul 2026</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2 }}>
                    <span style={{ fontSize: '36px', fontWeight: '800', color: '#FFFFFF' }}>$54.99<span style={{ fontSize: '16px', fontWeight: '500' }}> USD/mes</span></span>
                    <span style={{ fontSize: '12px', color: '#A78BFA' }}>Facturación mensual</span>
                    <Button variant="accent" size="sm" onClick={() => showToast('Cargando catálogo de planes...')}>Solicitar cambio de plan</Button>
                  </div>
                </Card>

                {/* Direct Bank Transfer Payment Details */}
                <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Método de pago
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Transferencia bancaria directa
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '24px',
                    margin: '20px 0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px 40px'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>BANCO</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>BBVA México</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>BENEFICIARIO</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>TallerOS Software SA de CV</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>CUENTA</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B', fontFamily: 'monospace' }}>0123 4567 8910</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>CLABE INTERBANCARIA</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B', fontFamily: 'monospace' }}>012 180 01234567891 0</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>REFERENCIA</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#3730A3', fontFamily: 'monospace' }}>TALLER-OR-2026-079</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>CONCEPTO SUGERIDO</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Pro Taller · Junio 2026</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="primary" onClick={() => setShowPaymentModal(true)}>
                      {paymentReceipt ? 'Actualizar comprobante cargado' : 'Enviar comprobante de pago'}
                    </Button>
                    <Button variant="outline" onClick={() => showToast('Descargando PDF de instrucciones...')}>Descargar instrucciones</Button>
                  </div>

                  {paymentReceipt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontSize: '13px', fontWeight: '600', marginTop: '12px' }}>
                      <Check size={16} />
                      <span>Comprobante cargado: {paymentReceipt}</span>
                    </div>
                  )}

                  {/* Payment Receipt Upload Dialog */}
                  {showPaymentModal && (
                    <div style={{
                      position: 'fixed',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: 'rgba(30, 27, 75, 0.45)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 999
                    }}>
                      <Card hoverable={false} style={{
                        width: '450px',
                        backgroundColor: '#FFFFFF',
                        padding: '32px',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px rgba(30, 27, 75, 0.2)'
                      }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' }}>
                          Cargar comprobante de pago
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                          Sube el comprobante de transferencia bancaria para verificar tu pago mensual.
                        </p>

                        <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{
                            border: '2px dashed #CBD5E1',
                            borderRadius: '12px',
                            padding: '32px',
                            textAlign: 'center',
                            backgroundColor: '#F8FAFC',
                            cursor: 'pointer'
                          }} onClick={() => showToast('Abrir selector de archivos...')}>
                            <CreditCard size={32} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#3730A3', display: 'block' }}>Seleccionar comprobante</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>PDF, JPG o PNG (Max. 5MB)</span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                            <Button variant="ghost" type="button" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>
                            <Button variant="primary" type="submit">Enviar comprobante</Button>
                          </div>
                        </form>
                      </Card>
                    </div>
                  )}
                </Card>

                {/* Billing History */}
                <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '20px' }}>
                    Historial de pagos
                  </h3>

                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAFAFD', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Fecha</th>
                          <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Concepto</th>
                          <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Monto</th>
                          <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Método</th>
                          <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Estado</th>
                          <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>01 Jun 2026</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#1E1B4B' }}>Pro Taller · Mensual</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '800', color: '#1E1B4B' }}>$54.99 USD</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B' }}>Transferencia BBVA</td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', backgroundColor: '#DCFCE7', color: '#15803D' }}>Confirmado</span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button onClick={() => showToast('Abriendo comprobante de pago...')} style={{ fontSize: '13px', fontWeight: '700', color: '#3730A3', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              Ver comprobante <ExternalLink size={14} />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
