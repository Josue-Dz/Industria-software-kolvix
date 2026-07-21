import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to admin dashboard by default
    navigate('/dashboard');
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
            src="/src/assets/logos/Logo 1.png"
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

          <Button type="submit" variant="primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px' }}>
            Ingresar al Taller
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/tecnico')}
            style={{ width: '100%', padding: '12px', borderRadius: '12px' }}
          >
            Ingresar como Técnico
          </Button>
        </form>
      </div>
    </div>
  );
};
