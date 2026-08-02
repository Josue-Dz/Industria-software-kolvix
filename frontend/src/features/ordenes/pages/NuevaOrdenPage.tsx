import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Plus, Upload, CheckCircle2 } from 'lucide-react';
import { authService } from '../../../api/services/authService';
import { clientesService } from '../../../api/services/clientesService';
import { dispositivosService } from '../../../api/services/dispositivosService';
import { tecnicosService } from '../../../api/services/tecnicosService';
import { ordenesService } from '../../../api/services/ordenesService';
import type {
  CategoriaDispositivoResponse,
  ClienteResponse,
  TecnicoResponse,
} from '../../../api/types';

export const NuevaOrdenPage: React.FC = () => {
  const navigate = useNavigate();

  // Catálogos cargados del backend
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDispositivoResponse[]>([]);
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);

  // Cliente ('' = registrar cliente nuevo)
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Dispositivo
  const [categoriaId, setCategoriaId] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [serial, setSerial] = useState('');
  const [accessories, setAccessories] = useState('');

  // Orden
  const [technicianId, setTechnicianId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [observations, setObservations] = useState('');

  // Evidencia visual (panel derecho, módulo de recepción pendiente de conectar)
  const [markType, setMarkType] = useState('Rotura / Crack');
  const [markNote, setMarkNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loadError, setLoadError] = useState('');

  const isExistingClient = selectedClienteId !== '';

  useEffect(() => {
    let isMounted = true;

    const loadCatalogs = async () => {
      try {
        const cachedUser = authService.getCachedUser();
        const user = cachedUser ?? await authService.getCurrentUser();
        if (!isMounted) return;
        setEmpresaId(user.empresaId);

        const [clientesResult, categoriasResult, tecnicosResult] = await Promise.allSettled([
          clientesService.listar(user.empresaId),
          dispositivosService.listarCategorias(),
          tecnicosService.listar(),
        ]);

        if (!isMounted) return;

        if (clientesResult.status === 'fulfilled') setClientes(clientesResult.value);
        if (categoriasResult.status === 'fulfilled') {
          setCategorias(categoriasResult.value);
          if (categoriasResult.value.length > 0) {
            setCategoriaId(String(categoriasResult.value[0].id));
          }
        } else {
          setLoadError('No se pudo cargar el catalogo de dispositivos. Verifica que el backend este activo.');
        }
        // Técnicos: un rol sin permiso recibe 403; la orden puede quedar sin asignar
        if (tecnicosResult.status === 'fulfilled') setTecnicos(tecnicosResult.value);
      } catch {
        if (isMounted) {
          setLoadError('No se pudo cargar la informacion inicial. Inicia sesion nuevamente.');
        }
      }
    };

    void loadCatalogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClienteChange = (value: string) => {
    setSelectedClienteId(value);
    if (value === '') {
      setClientName('');
      setClientLastName('');
      setPhone('');
      return;
    }
    const cliente = clientes.find((c) => String(c.idCliente) === value);
    if (cliente) {
      setClientName(cliente.nombre);
      setClientLastName(cliente.apellido);
      setPhone(cliente.telefono ?? '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (empresaId === null) {
      setSubmitError('No se pudo identificar la empresa activa. Inicia sesion nuevamente.');
      return;
    }
    if (categoriaId === '') {
      setSubmitError('Selecciona el tipo de dispositivo.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      let clienteId: number;
      if (isExistingClient) {
        clienteId = Number(selectedClienteId);
      } else {
        const cliente = await clientesService.crear(empresaId, {
          nombre: clientName.trim(),
          apellido: clientLastName.trim(),
          telefono: phone.trim() || undefined,
        });
        clienteId = cliente.idCliente;
        // Si un paso posterior falla, el reintento reutiliza este cliente en vez de duplicarlo
        setClientes((prev) => [cliente, ...prev]);
        setSelectedClienteId(String(cliente.idCliente));
      }

      const dispositivo = await dispositivosService.crear({
        idCliente: clienteId,
        idCategoria: Number(categoriaId),
        marca: brand.trim() || undefined,
        modelo: model.trim() || undefined,
        color: color.trim() || undefined,
        numeroSerie: serial.trim() || undefined,
        accesoriosRecibidos: accessories.trim() || undefined,
      });

      await ordenesService.crear(empresaId, {
        idCliente: clienteId,
        idDispositivo: dispositivo.idDispositivo,
        idTecnico: technicianId === '' ? undefined : Number(technicianId),
        problemaReportado: issueDescription.trim(),
        observaciones: observations.trim() || undefined,
      });

      navigate('/ordenes');
    } catch {
      setSubmitError('No se pudo registrar la orden. Revisa los datos e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Órdenes"
      subtitle=""
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Top Tabs matching Registro de ordenes.png */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/ordenes">
            <button style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: '#3730A3',
              border: 'none',
              cursor: 'pointer'
            }}>
              Lista de Órdenes
            </button>
          </Link>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            backgroundColor: '#EDE9FE',
            color: '#3730A3',
            border: 'none'
          }}>
            <Plus size={18} /> Registrar Nuevo Ingreso
          </button>
        </div>

        {/* Main Card Container */}
        <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Registro Inteligente de Orden
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Siga cada campo para digitalizar de inmediato el ingreso del cliente.
            </p>
          </div>

          {loadError && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              {loadError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>

              {/* Left Section: 1. Información Operativa y de Contacto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    1. Información Operativa y de Contacto
                  </h3>
                </div>

                <div className="input-group">
                  <label className="input-label">CLIENTE</label>
                  <select
                    className="input-field"
                    value={selectedClienteId}
                    onChange={(e) => handleClienteChange(e.target.value)}
                  >
                    <option value="">-- Registrar cliente nuevo --</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.idCliente} value={String(cliente.idCliente)}>
                        {cliente.nombre} {cliente.apellido}{cliente.telefono ? ` — ${cliente.telefono}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid-2">
                  <Input
                    label="NOMBRE DE CLIENTE *"
                    placeholder="Nombre del cliente"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={isExistingClient}
                    maxLength={50}
                    required
                  />
                  <Input
                    label="APELLIDO DE CLIENTE *"
                    placeholder="Ej. Reyes"
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    disabled={isExistingClient}
                    maxLength={50}
                    required
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="TELÉFONO DE ENLACE"
                    placeholder="Ej. +504 8956-3652"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isExistingClient}
                    maxLength={20}
                  />

                  <div className="input-group">
                    <label className="input-label">TIPO DE DISPOSITIVO *</label>
                    <select
                      className="input-field"
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      required
                    >
                      {categorias.length === 0 && <option value="">Cargando catalogo...</option>}
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={String(categoria.id)}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-3">
                  <Input
                    label="MARCA *"
                    placeholder="Ej. Samsung"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    maxLength={50}
                    required
                  />

                  <Input
                    label="MODELO *"
                    placeholder="Ej. Galaxy 23"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    maxLength={50}
                    required
                  />

                  <Input
                    label="COLOR (OPCIONAL)"
                    placeholder="Ej. Negro"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    maxLength={30}
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="NÚMERO DE SERIE (OPCIONAL)"
                    placeholder="Escriba código de etiqueta"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    maxLength={80}
                  />

                  <Input
                    label="ACCESORIOS RECIBIDOS (OPCIONAL)"
                    placeholder="Ej. Cargador, estuche"
                    value={accessories}
                    onChange={(e) => setAccessories(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">ASIGNAR TÉCNICO RESPONSABLE</label>
                  <select
                    className="input-field"
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                  >
                    <option value="">-- Dejar sin asignar temporalmente --</option>
                    {tecnicos.filter((tecnico) => tecnico.activo).map((tecnico) => (
                      <option key={tecnico.idTecnico} value={String(tecnico.idTecnico)}>
                        {tecnico.nombre} {tecnico.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">FALLO REPORTADO (DESCRIPCIÓN)</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Describa el fallo indicado por el cliente..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    maxLength={500}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">OBSERVACIONES (OPCIONAL)</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Notas internas del ingreso..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    maxLength={300}
                  />
                </div>
              </div>

              {/* Right Section: 2. Evidencia Visual Antireclamos */}
              <div style={{
                backgroundColor: '#FAFAFD',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    2. Evidencia Visual Antireclamos
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                    Haga click sobre el esquema de celular para fijar la ubicación exacta de golpes, rasguños o vidrios fracturados del equipo recibidos en recepción del cliente.
                  </p>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', textTransform: 'uppercase' }}>TIPO DE MARCA:</label>
                  <select
                    className="input-field"
                    value={markType}
                    onChange={(e) => setMarkType(e.target.value)}
                  >
                    <option value="Rotura / Crack">Rotura / Crack</option>
                    <option value="Rasguño / Rayón">Rasguño / Rayón</option>
                    <option value="Golpe / Abolladura">Golpe / Abolladura</option>
                    <option value="Desgaste normal">Desgaste normal</option>
                  </select>
                </div>

                <Input
                  placeholder="Añadir nota a la marca (Ej. Camara frontal quebrada)"
                  value={markNote}
                  onChange={(e) => setMarkNote(e.target.value)}
                />

                <div style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '14px',
                  padding: '40px 16px',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  <Upload size={32} color="#6366F1" />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Subir evidencia de las marcas del dispositivo al ser entregado al taller...
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Archivos compatibles: .jpg y .png
                  </span>
                </div>
              </div>

            </div>

            {submitError && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
                fontSize: '13px',
                fontWeight: '600',
                marginTop: '24px'
              }}>
                {submitError}
              </div>
            )}

            {/* Bottom Right Action Buttons matching Registro de ordenes.png */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => navigate('/ordenes')}
                style={{ borderRadius: '12px', padding: '12px 24px', borderColor: '#3730A3', color: '#3730A3' }}
              >
                Cancelar registro
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                style={{ backgroundColor: '#3730A3', borderRadius: '12px', padding: '12px 32px' }}
                icon={<CheckCircle2 size={18} />}
              >
                {isSubmitting ? 'Generando ticket...' : 'Generar ticket'}
              </Button>
            </div>

          </form>

        </Card>
      </div>
    </DashboardLayout>
  );
};
