import React, { useState } from 'react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Search, CheckCircle, Star } from 'lucide-react';
import { seguimientoApi } from '../../../api/services/seguimiento';
import type { SeguimientoOrden } from '../../../api/types.ts';

export const ConsultaReparacionPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [data, setData] = useState<SeguimientoOrden | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // estado del formulario de reseña
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviandoReview, setEnviandoReview] = useState(false);

  const handleSearch = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const resultado = await seguimientoApi.consultar(code.trim());
      setData(resultado);
    } catch {
      setError('No se encontró ninguna orden con ese código.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarReview = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!data) return;

    setEnviandoReview(true);
    try {
      await seguimientoApi.crearReview(
        data.orden.idOrden,
        data.orden.idCliente,
        calificacion,
        comentario
      );
      const actualizado = await seguimientoApi.consultar(data.orden.codigoSeguimiento);
      setData(actualizado);
      setComentario('');
    } catch {
      alert('No se pudo enviar la reseña. Intenta de nuevo.');
    } finally {
      setEnviandoReview(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFD' }}>
      <Navbar />

      <section style={{ backgroundColor: '#3730A3', color: '#FFFFFF', padding: '60px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
            Consultar Estado de Reparación
          </h1>
          <p style={{ fontSize: '15px', color: '#EDE9FE', marginBottom: '28px' }}>
            Revisa en tiempo real el progreso de tu equipo en el taller
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '16px' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Ingresa tu código de seguimiento"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                icon={<Search size={20} />}
                style={{ border: 'none', boxShadow: 'none' }}
              />
            </div>
            <Button type="submit" variant="accent" style={{ borderRadius: '12px', padding: '12px 24px' }} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </form>

          {error && <p style={{ color: '#FCA5A5', marginTop: '16px' }}>{error}</p>}
        </div>
      </section>

      {data && (
        <section style={{ padding: '48px 0 80px 0', flex: 1 }}>
          <div className="container" style={{ maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
                    {data.orden.nombreEstado}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B' }}>
                    Orden #{data.orden.numeroOrden}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>{data.orden.nombreCliente}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>Fecha de Ingreso</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1E1B4B' }}>
                    {new Date(data.orden.fechaIngreso).toLocaleDateString('es-HN')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '24px 0', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Dispositivo</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>{data.orden.dispositivoResumen}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Problema reportado</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>{data.orden.problemaReportado}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Estado Actual</span>
                  <span
                    className="badge"
                    style={{ backgroundColor: data.orden.colorHexEstado, color: '#FFFFFF' }}
                  >
                    {data.orden.nombreEstado}
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '24px' }}>
                  Progreso de la reparación
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {data.historial.length === 0 ? (
                    <p style={{ color: '#64748B' }}>Aún no hay eventos registrados para esta orden.</p>
                  ) : (
                    data.historial.map((evento) => (
                      <div key={evento.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: evento.estadoNuevoColorHex, color: '#FFFFFF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                        }}>
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>{evento.estadoNuevoNombre}</h4>
                          {evento.comentario && <p style={{ fontSize: '13px', color: '#64748B' }}>{evento.comentario}</p>}
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                            {new Date(evento.fecha).toLocaleString('es-HN')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {data.cuentasPago.length > 0 && (
              <Card style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px' }}>
                  Cuentas para realizar tu pago
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.cuentasPago.map((cuenta) => (
                    <div key={cuenta.id} style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                      <p style={{ fontWeight: '700', color: '#1E1B4B' }}>{cuenta.banco} — {cuenta.tipoCuenta}</p>
                      <p style={{ fontSize: '14px', color: '#475569' }}>Cuenta: {cuenta.numeroCuenta}</p>
                      <p style={{ fontSize: '14px', color: '#475569' }}>Titular: {cuenta.titular}</p>
                      {cuenta.instrucciones && (
                        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{cuenta.instrucciones}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {data.puedeCalificar && (
              <Card style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '16px' }}>
                  ¿Cómo fue tu experiencia?
                </h3>
                <form onSubmit={handleEnviarReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCalificacion(n)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Star
                          size={28}
                          color="#F59E0B"
                          fill={n <= calificacion ? '#F59E0B' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Cuéntanos sobre tu experiencia (opcional)"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={3}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontFamily: 'inherit' }}
                  />
                  <Button type="submit" variant="accent" disabled={enviandoReview}>
                    {enviandoReview ? 'Enviando...' : 'Enviar reseña'}
                  </Button>
                </form>
              </Card>
            )}

            {data.review && (
              <Card style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '12px' }}>
                  Tu reseña
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Star size={18} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontWeight: '700' }}>{data.review.calificacion} / 5</span>
                </div>
                {data.review.comentario && <p style={{ color: '#475569' }}>{data.review.comentario}</p>}
              </Card>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};
