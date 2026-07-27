import React, { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { 
  Play, 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  Video, 
  X, 
  Check, 
  HelpCircle,
  Clock,
  ThumbsUp
} from 'lucide-react';

interface TutorialVideo {
  id: string;
  titulo: string;
  duracion: string;
  nivel: string;
  color: string;
  youtubeId?: string;
}

export const SoportePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<TutorialVideo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tutorials: TutorialVideo[] = [
    { id: '1', titulo: 'Cómo recibir un equipo paso a paso', duracion: '4 min', nivel: 'básico', color: '#6366F1' },
    { id: '2', titulo: 'Generar y enviar una cotización por WhatsApp', duracion: '6 min', nivel: 'básico', color: '#10B981' },
    { id: '3', titulo: 'Configurar estados personalizados del flujo', duracion: '8 min', nivel: 'avanzado', color: '#8B5CF6' },
    { id: '4', titulo: 'Cierre del día y conciliación de caja', duracion: '5 min', nivel: 'intermedio', color: '#F59E0B' },
    { id: '5', titulo: 'Integración con WhatsApp Business API', duracion: '12 min', nivel: 'avanzado', color: '#6366F1' },
    { id: '6', titulo: 'Gestión de inventario y proveedores', duracion: '9 min', nivel: 'intermedio', color: '#8B5CF6' }
  ];

  const filteredTutorials = tutorials.filter(video => 
    video.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLikeVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedVideos(prev => ({ ...prev, [id]: !prev[id] }));
    showToast(likedVideos[id] ? 'Voto removido' : '¡Gracias por calificar este tutorial!');
  };

  return (
    <DashboardLayout
      title="Soporte"
      subtitle="Asistencia y documentación · Mario Reyes · Admin · Hoy"
      role="admin"
    >
      {/* Toast Alert */}
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
          fontSize: '14px',
          fontWeight: '600',
          borderLeft: '4px solid #6366F1'
        }}>
          <Check size={18} color="#A78BFA" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Page title and description */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Centro de soporte
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
            Encuentra respuestas, tutoriales en video y contacta a nuestro equipo técnico
          </p>
        </div>

        {/* Large FAQ Search Banner */}
        <Card hoverable={false} style={{
          background: 'linear-gradient(135deg, #F4F0FF 0%, #EDE9FE 100%)',
          border: '1px solid #EDE9FE',
          borderRadius: '20px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            ¿En qué podemos ayudarte?
          </h3>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0, maxWidth: '500px' }}>
            Busca respuestas rápidas en nuestra base de conocimientos o conecta directamente con el equipo de soporte.
          </p>

          <div style={{
            display: 'flex',
            width: '100%',
            maxWidth: '600px',
            gap: '12px',
            position: 'relative',
            marginTop: '8px'
          }}>
            <Input 
              placeholder="Ej. 'Cómo enviar cotización' o 'Configurar estados'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
              style={{ paddingLeft: '48px', height: '48px', borderRadius: '12px' }}
            />
            <Button variant="primary" onClick={() => showToast(`Buscando: "${searchQuery}"`)} style={{ height: '48px', borderRadius: '12px', flexShrink: 0 }}>
              Buscar
            </Button>
          </div>
        </Card>

        {/* Support content grid: video list & support channels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* Left Column: Video Tutorials */}
          <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Video size={20} color="#3730A3" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                Tutoriales en video
              </h3>
            </div>

            {filteredTutorials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                No se encontraron tutoriales que coincidan con la búsqueda.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                {filteredTutorials.map((video) => (
                  <Card 
                    key={video.id} 
                    onClick={() => setActiveVideo(video)}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '140px',
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: `${video.color}15`,
                        color: video.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={18} fill={video.color} />
                      </div>
                      <button 
                        onClick={(e) => handleLikeVideo(video.id, e)}
                        style={{
                          color: likedVideos[video.id] ? '#10B981' : '#94A3B8',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '50%'
                        }}
                        title="Es útil"
                      >
                        <ThumbsUp size={16} fill={likedVideos[video.id] ? '#10B981' : 'none'} />
                      </button>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', lineHeight: 1.4, marginBottom: '8px' }}>
                        {video.titulo}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: '700' }}>
                        <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {video.duracion}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: video.nivel === 'básico' ? '#DCFCE7' : video.nivel === 'intermedio' ? '#FEF3C7' : '#F4F0FF',
                          color: video.nivel === 'básico' ? '#15803D' : video.nivel === 'intermedio' ? '#D97706' : '#3730A3',
                          textTransform: 'uppercase'
                        }}>
                          {video.nivel}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Right Column: Help Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Chat Card */}
            <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <MessageSquare size={20} color="#3730A3" style={{ marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Chat en vivo</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    Respuesta promedio en 3 minutos · Lun a Vie 9:00 - 19:00
                  </p>
                </div>
              </div>
              <Button variant="primary" style={{ width: '100%', borderRadius: '10px' }} onClick={() => showToast('Abriendo ventana de chat de soporte...')}>
                Iniciar chat
              </Button>
            </Card>

            {/* WhatsApp Support Card */}
            <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <Phone size={20} color="#10B981" style={{ marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>WhatsApp soporte</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    Para incidencias de facturación u operativas urgentes 24/7
                  </p>
                </div>
              </div>
              <a href="https://wa.me/525551009000" target="_blank" rel="noopener noreferrer">
                <Button variant="accent" style={{ width: '100%', borderRadius: '10px', backgroundColor: '#10B981', borderColor: '#10B981' }}>
                  +52 555 100 9000
                </Button>
              </a>
            </Card>

            {/* Email Support Card */}
            <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <Mail size={20} color="#6366F1" style={{ marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Soporte por Correo</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Respuesta garantizada en menos de 24 horas
                  </p>
                </div>
              </div>
              <a href="mailto:soporte@talleros.mx" style={{ fontSize: '14px', fontWeight: '700', color: '#3730A3', display: 'block', padding: '4px 0' }}>
                soporte@talleros.mx
              </a>
            </Card>

            {/* Documentation quick links */}
            <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FAFAFD', border: '1px dashed #CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <HelpCircle size={16} color="#64748B" />
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', margin: 0 }}>¿Buscas documentación completa?</h4>
              </div>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block', lineHeight: 1.4, marginBottom: '12px' }}>
                Revisa los manuales operativos de TallerOS para configurar integraciones y permisos avanzados.
              </span>
              <button 
                onClick={() => showToast('Abriendo documentación del desarrollador...')} 
                style={{ fontSize: '13px', fontWeight: '700', color: '#3730A3', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Ir a documentación →
              </button>
            </Card>

          </div>

        </div>

      </div>

      {/* Video Playback Modal Overlay */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(30, 27, 75, 0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <Card hoverable={false} style={{
            width: '680px',
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '20px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setActiveVideo(null)}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                color: '#64748B',
                padding: '6px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', marginBottom: '4px', maxWidth: '90%' }}>
              {activeVideo.titulo}
            </h3>
            <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '16px' }}>
              Duración: {activeVideo.duracion} · Nivel: {activeVideo.nivel}
            </span>

            {/* Simulated Video Player */}
            <div style={{
              width: '100%',
              height: '360px',
              backgroundColor: '#1E1B4B',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              gap: '16px',
              position: 'relative',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
            }}>
              <Play size={48} fill="#FFFFFF" style={{ opacity: 0.9, cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => showToast('Iniciando reproducción del tutorial...')} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', display: 'block' }}>Reproductor de video TallerOS</span>
                <span style={{ fontSize: '11px', color: '#A78BFA' }}>Haga clic para iniciar tutorial interactivo</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>¿Te resultó útil este video?</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  variant={likedVideos[activeVideo.id] ? 'primary' : 'outline'} 
                  size="sm" 
                  onClick={(e) => handleLikeVideo(activeVideo.id, e)}
                >
                  Sí, ¡gracias!
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setActiveVideo(null); showToast('Gracias por tu feedback.'); }}>No útil</Button>
              </div>
            </div>

          </Card>
        </div>
      )}

    </DashboardLayout>
  );
};
