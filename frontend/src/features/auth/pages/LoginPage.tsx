import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../auth/useAuth';
import { rutaInicialPorRol } from '../../../auth/authContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { iniciarSesion } = useAuth();

  // Ruta que el usuario intentaba abrir antes de que lo mandaran al login.
  const desde = (location.state as { desde?: string } | null)?.desde;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const user = await iniciarSesion({ correo: email, password });
      navigate(desde ?? rutaInicialPorRol(user.rol), { replace: true });
    } catch {
      setLoginError('No se pudo iniciar sesion. Revisa tus credenciales.');
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
      position: 'relative'
    }}>
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          color: '#EDE9FE',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        <ArrowLeft size={18} /> Volver al Inicio
      </Link>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        textAlign: 'center'
      }}>
        {/* Kolvix Brand Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img
            src="/logos/Logo 1.png"
            alt="Kolvix Logo"
            style={{ height: '48px', objectFit: 'contain' }}
          />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' }}>
          Iniciar Sesión
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>
          Ingresa tus credenciales para acceder al sistema
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@kolvix.hn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <a href="#" style={{ fontSize: '13px', color: '#6366F1', fontWeight: '600' }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px' }}
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar al Taller'}
          </Button>

          {loginError && (
            <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: '600', margin: 0, textAlign: 'center' }}>
              {loginError}
            </p>
          )}

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', marginTop: '12px' }}>
        ¿No tienes cuenta? <Link to="/registro" style={{ color: '#6366F1', fontWeight: '600' }}>Registra tu taller</Link>
        </p>

        </form>
      </div>
    </div>
  );
};
