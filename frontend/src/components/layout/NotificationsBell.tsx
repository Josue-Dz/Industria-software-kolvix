import React, { useEffect, useRef, useState } from 'react';
import { Bell, MessageCircle, Mail } from 'lucide-react';
import { notificacionesService } from '../../api/services/notificacionesService';
import type { NotificacionResponse } from '../../api/types';

const formatoFecha = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleString('es-HN', { dateStyle: 'short', timeStyle: 'short' }) : '';

export const NotificationsBell: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<NotificacionResponse[]>([]);
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let activo = true;

    const cargarNotificaciones = async () => {
      try {
        const data = await notificacionesService.listarPendientes();
        if (activo) {
          setNotificaciones(data);
        }
      } catch {
        // Sin backend o sin sesión: la campana queda vacía sin romper el layout.
      }
    };

    void cargarNotificaciones();

    return () => {
      activo = false;
    };
  }, []);

  // Cierra el panel al hacer clic fuera de la campana.
  useEffect(() => {
    if (!abierto) return;
    const handleClickFuera = (evento: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, [abierto]);

  return (
    <div ref={contenedorRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setAbierto(prev => !prev)}
        title={notificaciones.length > 0 ? `${notificaciones.length} notificaciones pendientes` : 'Sin notificaciones pendientes'}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: abierto ? '#EDE9FE' : '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#475569',
          position: 'relative',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Bell size={20} />
        {notificaciones.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            minWidth: '16px',
            height: '16px',
            padding: '0 4px',
            backgroundColor: '#6366F1',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {notificaciones.length > 9 ? '9+' : notificaciones.length}
          </span>
        )}
      </button>

      {abierto && (
        <div style={{
          position: 'absolute',
          top: '48px',
          right: 0,
          width: '340px',
          maxHeight: '420px',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
          zIndex: 1100,
          padding: '16px'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
            Notificaciones pendientes
          </span>

          {notificaciones.length === 0 && (
            <span style={{ fontSize: '13px', color: '#94A3B8', display: 'block', padding: '8px 0' }}>
              No hay notificaciones pendientes de envío.
            </span>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notificaciones.slice(0, 8).map((notif) => (
              <div key={notif.id} style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '10px 12px',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#EDE9FE',
                  color: '#3730A3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {notif.canal === 'WHATSAPP' ? <MessageCircle size={15} /> : <Mail size={15} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B', display: 'block' }}>
                    {notif.asunto ?? 'Notificación al cliente'}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#475569',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {notif.cuerpo}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                    Para: {notif.destinatario}
                    {notif.ordenId ? ` · Orden #${notif.ordenId}` : ''}
                    {notif.fechaProgramada ? ` · ${formatoFecha(notif.fechaProgramada)}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {notificaciones.length > 8 && (
            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginTop: '10px', textAlign: 'center' }}>
              y {notificaciones.length - 8} más...
            </span>
          )}
        </div>
      )}
    </div>
  );
};
