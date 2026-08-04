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
import { plantillasInspeccionService, recepcionService } from '../../../api/services/recepcionService';
import { ChasisInteractivo } from '../detalle/ChasisInteractivo';
import { BuscadorCliente } from '../nueva/BuscadorCliente';
import { SelectorDispositivo } from '../nueva/SelectorDispositivo';
import type {
  CategoriaDispositivoResponse,
  ClienteResponse,
  DanoFisico,
  DispositivoResponse,
  PlantillaInspeccionResponse,
  CargaTecnicoResponse,
  VistaChasis,
} from '../../../api/types';

const VISTAS_POR_DEFECTO: VistaChasis[] = [
  { codigo: 'FRONTAL', titulo: 'Frontal', orden: 1 },
  { codigo: 'TRASERA', titulo: 'Trasera', orden: 2 },
  { codigo: 'LATERAL_IZQ', titulo: 'Lateral izq.', orden: 3 },
  { codigo: 'LATERAL_DER', titulo: 'Lateral der.', orden: 4 },
];

export const NuevaOrdenPage: React.FC = () => {
  const navigate = useNavigate();

  // Catálogos cargados del backend
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDispositivoResponse[]>([]);
  // Ordenados por carga: el backend devuelve primero al menos ocupado.
  const [tecnicos, setTecnicos] = useState<CargaTecnicoResponse[]>([]);

  // Cliente ('' = registrar cliente nuevo)
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Dispositivo (null = se registra uno nuevo; si no, se reutiliza el del cliente)
  const [dispositivoExistente, setDispositivoExistente] = useState<DispositivoResponse | null>(null);
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

  // Evidencia visual: daños marcados sobre el chasis del equipo recibido.
  const [danos, setDanos] = useState<DanoFisico[]>([]);
  const [plantillas, setPlantillas] = useState<PlantillaInspeccionResponse[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loadError, setLoadError] = useState('');

  const isExistingClient = selectedClienteId !== '';
  const clienteSeleccionado =
    clientes.find((cliente) => String(cliente.idCliente) === selectedClienteId) ?? null;

  // La plantilla decide qué caras del equipo se pueden marcar; si la categoría
  // no tiene una cargada se usan las vistas genéricas.
  const plantillaActiva = plantillas.find((p) => String(p.categoriaId) === categoriaId) ?? null;
  const vistasChasis =
    plantillaActiva && plantillaActiva.vistas.length > 0 ? plantillaActiva.vistas : VISTAS_POR_DEFECTO;

  useEffect(() => {
    let isMounted = true;

    const cargarPlantillas = async () => {
      if (categoriaId === '') return;

      try {
        const disponibles = await plantillasInspeccionService.listar(Number(categoriaId));
        if (isMounted) setPlantillas(disponibles);
      } catch {
        if (isMounted) setPlantillas([]);
      }
    };

    void cargarPlantillas();
    return () => {
      isMounted = false;
    };
  }, [categoriaId]);

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
          tecnicosService.listarCarga(),
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

  const handleSeleccionarCliente = (cliente: ClienteResponse | null) => {
    setSelectedClienteId(cliente ? String(cliente.idCliente) : '');
    setClientName(cliente?.nombre ?? '');
    setClientLastName(cliente?.apellido ?? '');
    setPhone(cliente?.telefono ?? '');
    setDispositivoExistente(null);
  };

  const handleSeleccionarDispositivo = (dispositivo: DispositivoResponse | null) => {
    setDispositivoExistente(dispositivo);
    setDanos([]);
    if (dispositivo) {
      // El chasis se dibuja según la categoría, así que se toma la del equipo elegido.
      setCategoriaId(dispositivo.idCategoria === null ? '' : String(dispositivo.idCategoria));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (empresaId === null) {
      setSubmitError('No se pudo identificar la empresa activa. Inicia sesion nuevamente.');
      return;
    }
    if (dispositivoExistente === null && categoriaId === '') {
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

      // Si el cliente vuelve con un equipo ya registrado se reutiliza su ficha,
      // en vez de crear un duplicado en cada visita.
      const idDispositivo =
        dispositivoExistente?.idDispositivo ??
        (
          await dispositivosService.crear({
            idCliente: clienteId,
            idCategoria: Number(categoriaId),
            marca: brand.trim() || undefined,
            modelo: model.trim() || undefined,
            color: color.trim() || undefined,
            numeroSerie: serial.trim() || undefined,
            accesoriosRecibidos: accessories.trim() || undefined,
          })
        ).idDispositivo;

      const orden = await ordenesService.crear(empresaId, {
        idCliente: clienteId,
        idDispositivo,
        idTecnico: technicianId === '' ? undefined : Number(technicianId),
        problemaReportado: issueDescription.trim(),
        observaciones: observations.trim() || undefined,
      });

      if (danos.length > 0) {
        await recepcionService.registrar({
          ordenId: orden.idOrden,
          plantillaInspeccionId: plantillaActiva?.id ?? null,
          danosFisicos: danos,
          observaciones: observations.trim() || undefined,
          aceptacionCliente: false,
        });
      }

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

                <BuscadorCliente
                  clientes={clientes}
                  seleccionado={clienteSeleccionado}
                  onSeleccionar={handleSeleccionarCliente}
                />

                {!isExistingClient && (
                  <>
                    <div className="grid-2">
                      <Input
                        label="Nombre *"
                        placeholder="Ej. Andrea"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        maxLength={50}
                        required
                      />
                      <Input
                        label="Apellido *"
                        placeholder="Ej. Zelaya"
                        value={clientLastName}
                        onChange={(e) => setClientLastName(e.target.value)}
                        maxLength={50}
                        required
                      />
                    </div>

                    <Input
                      label="Teléfono"
                      placeholder="Ej. 9855-2210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={20}
                      inputMode="tel"
                    />
                  </>
                )}

                <SelectorDispositivo
                  clienteId={isExistingClient ? Number(selectedClienteId) : null}
                  seleccionado={dispositivoExistente}
                  onSeleccionar={handleSeleccionarDispositivo}
                />

                {dispositivoExistente === null && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Tipo de dispositivo *</label>
                      <select
                        className="input-field"
                        value={categoriaId}
                        onChange={(e) => {
                          setCategoriaId(e.target.value);
                          setDanos([]);
                        }}
                        required
                      >
                        {categorias.length === 0 && <option value="">Cargando catálogo…</option>}
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={String(categoria.id)}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid-3">
                      <Input
                        label="Marca *"
                        placeholder="Ej. Samsung"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        maxLength={50}
                        required
                      />

                      <Input
                        label="Modelo *"
                        placeholder="Ej. Galaxy S22"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        maxLength={50}
                        required
                      />

                      <Input
                        label="Color"
                        placeholder="Ej. Negro mate"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        maxLength={30}
                      />
                    </div>

                    <div className="grid-2">
                      <Input
                        label="Número de serie o IMEI"
                        placeholder="Ej. SM-S901ULB7734"
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        maxLength={80}
                      />

                      <Input
                        label="Accesorios recibidos"
                        placeholder="Ej. Cargador, funda, tarjeta SIM"
                        value={accessories}
                        onChange={(e) => setAccessories(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label className="input-label">Técnico responsable</label>
                  <select
                    className="input-field"
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                  >
                    <option value="">Asignar más tarde</option>
                    {tecnicos.map((tecnico, indice) => (
                      <option key={tecnico.idTecnico} value={String(tecnico.idTecnico)}>
                        {tecnico.nombre} {tecnico.apellido} · {tecnico.ordenesActivas}{' '}
                        {tecnico.ordenesActivas === 1 ? 'orden activa' : 'órdenes activas'}
                        {indice === 0 && tecnicos.length > 1 ? ' — sugerido' : ''}
                      </option>
                    ))}
                  </select>
                  {tecnicos.length > 1 && (
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                      Se sugiere al técnico con menos órdenes abiertas, pero puedes elegir otro.
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">Fallo reportado por el cliente *</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Ej. Se apaga sola a los 10 minutos y no carga con el cable original"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    maxLength={500}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Observaciones internas</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Ej. Cliente autoriza abrir el equipo. No deja cargador."
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
                    Marca sobre el esquema del equipo dónde viene cada golpe, rayón o vidrio quebrado. Queda como respaldo del estado en que ingresó.
                  </p>
                </div>

                <ChasisInteractivo
                  categoriaId={categoriaId === '' ? null : Number(categoriaId)}
                  vistas={vistasChasis}
                  danos={danos}
                  onChange={setDanos}
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
