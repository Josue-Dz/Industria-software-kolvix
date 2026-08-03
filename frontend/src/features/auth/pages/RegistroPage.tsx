import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams} from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Building2, Mail, Lock, User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { authService } from '../../../api/services/authService';


const PLANES = [
  { codigo: 'BASICO', nombre: 'Básico', precio: '$ 9.99/mes' },
  { codigo: 'PROFESIONAL', nombre: 'Profesional', precio: '$ 24.99/mes' },
  { codigo: 'EMPRESARIAL', nombre: 'Empresarial', precio: '$ 59.99/mes' },
];

export const RegistroPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planPreseleccionado = searchParams.get('plan');
  const codigosValidos = ['BASICO', 'PROFESIONAL', 'EMPRESARIAL'];

  const [form, setForm] = useState({
    nombre: '',
    rtn: '',
    telefono: '',
    correo: '',
    direccion: '',
    codigoPlan: planPreseleccionado && codigosValidos.includes(planPreseleccionado)
      ? planPreseleccionado
      : 'BASICO',
    nombreAdministrador: '',
    apellidoAdministrador: '',
    correoAdministrador: '',
    password: '',
  });

  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (campo: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (form.password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.registrarEmpresa(form);
      // El backend ya deja al admin autenticado (cookie) al registrar
      navigate('/dashboard');
    } catch (err: unknown) {
      // Verificamos si es un error de Axios
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.message || 'No se pudo completar el registro. Verifica los datos.';
        setError(mensaje);
      } else {
        // Para errores genéricos de JS
        setError('No se pudo completar el registro. Verifica los datos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1E1B4B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
    }}>
      <Link
        to="/"
        style={{
          position: 'absolute', top: '32px', left: '32px', color: '#EDE9FE',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600',
        }}
      >
        <ArrowLeft size={18} /> Volver al Inicio
      </Link>

      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img src="/logos/Logo 1.png" alt="Kolvix Logo" style={{ height: '48px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' }}>
            Registra tu taller
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            Crea la cuenta de tu taller y del administrador en un solo paso
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>

          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#3730A3', marginTop: '8px' }}>
            Datos del taller
          </h3>

          <Input
            label="Nombre del taller"
            placeholder="TechFix"
            value={form.nombre}
            onChange={handleChange('nombre')}
            icon={<Building2 size={18} />}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="RTN (opcional)"
              placeholder="0801-1999-12345"
              value={form.rtn}
              onChange={handleChange('rtn')}
              required={false}
            />
            <Input
              label="Teléfono"
              placeholder="99998888"
              value={form.telefono}
              onChange={handleChange('telefono')}
              icon={<Phone size={18} />}
              required
            />
          </div>

          <Input
            label="Correo del taller"
            type="email"
            placeholder="contacto@techfix.hn"
            value={form.correo}
            onChange={handleChange('correo')}
            icon={<Mail size={18} />}
            required
          />

          <Input
            label="Dirección"
            placeholder="Tegucigalpa, Honduras"
            value={form.direccion}
            onChange={handleChange('direccion')}
            icon={<MapPin size={18} />}
            required
          />

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              Plan de suscripción
            </label>
            <select
              value={form.codigoPlan}
              onChange={(e) => setForm((prev) => ({ ...prev, codigoPlan: e.target.value }))}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px',
                border: '1px solid #E2E8F0', fontSize: '14px', backgroundColor: '#FFFFFF',
              }}
            >
              {PLANES.map((plan) => (
                <option key={plan.codigo} value={plan.codigo}>
                  {plan.nombre} — {plan.precio}
                </option>
              ))}
            </select>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#3730A3', marginTop: '8px' }}>
            Datos del administrador
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Nombre"
              placeholder="Daniel"
              value={form.nombreAdministrador}
              onChange={handleChange('nombreAdministrador')}
              icon={<User size={18} />}
              required
            />
            <Input
              label="Apellido"
              placeholder="Oyuela"
              value={form.apellidoAdministrador}
              onChange={handleChange('apellidoAdministrador')}
              required
            />
          </div>

          <Input
            label="Correo del administrador"
            type="email"
            placeholder="daniel@techfix.hn"
            value={form.correoAdministrador}
            onChange={handleChange('correoAdministrador')}
            icon={<Mail size={18} />}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange('password')}
              icon={<Lock size={18} />}
              required
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite la contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />
          </div>

          {error && (
            <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: '600', margin: 0, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px' }}
          >
            {isSubmitting ? 'Registrando...' : 'Crear mi taller'}
          </Button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#6366F1', fontWeight: '600' }}>Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};