import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  ArrowLeft,
  User,
  Wrench,
  Calendar,
  CheckCircle,
  XCircle,
  Info,
  Stethoscope,
  FileText,
  Camera,
  Send,
  Plus,
  Search,
  Package,
  X,
  Trash2
} from 'lucide-react';
import { authService } from '../../../api/services/authService';
import { ordenesService } from '../../../api/services/ordenesService';
import { diagnosticosService } from '../../../api/services/diagnosticosService';
import { cotizacionesService } from '../../../api/services/cotizacionesService';
import { evidenciasService } from '../../../api/services/evidenciasService';
import { repuestosService } from '../../../api/services/repuestosService';
import { tecnicosService } from '../../../api/services/tecnicosService';
import type {
  AlbumEvidenciaResponse,
  ComplejidadDiagnostico,
  CotizacionResponse,
  DiagnosticoResponse,
  EstadoReparacionResponse,
  EvidenciaFotograficaResponse,
  OrdenTrabajoResponse,
  RepuestoResponse,
  TecnicoResponse,
  UsuarioResponse,
} from '../../../api/types';

const formatMoney = (monto: number | null | undefined): string =>
  monto === null || monto === undefined ? '—' : `L. ${Number(monto).toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

const formatDate = (fecha: string | null | undefined): string =>
  fecha ? new Date(fecha).toLocaleDateString('es-HN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const ESTADO_COTIZACION_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente (borrador)',
  ENVIADA: 'Enviada al cliente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  VENCIDA: 'Vencida',
  CANCELADA: 'Cancelada',
};

export const DetalleOrdenPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ordenId = Number(id);

  const [activeSubTab, setActiveSubTab] = useState<'info' | 'diag' | 'cot' | 'evi'>('info');
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [orden, setOrden] = useState<OrdenTrabajoResponse | null>(null);
  const [estados, setEstados] = useState<EstadoReparacionResponse[]>([]);
  const [diagnostico, setDiagnostico] = useState<DiagnosticoResponse | null>(null);
  const [cotizaciones, setCotizaciones] = useState<CotizacionResponse[]>([]);
  const [evidencias, setEvidencias] = useState<EvidenciaFotograficaResponse[]>([]);
  const [albumes, setAlbumes] = useState<AlbumEvidenciaResponse[]>([]);
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);
  const [inventario, setInventario] = useState<RepuestoResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionOk, setActionOk] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Formulario de diagnóstico
  const [diagTecnicoId, setDiagTecnicoId] = useState('');
  const [diagProblema, setDiagProblema] = useState('');
  const [diagCausa, setDiagCausa] = useState('');
  const [diagTiempo, setDiagTiempo] = useState('');
  const [diagComplejidad, setDiagComplejidad] = useState<'' | ComplejidadDiagnostico>('');
  const [diagObs, setDiagObs] = useState('');

  // Cotización
  const [manoObra, setManoObra] = useState('');
  const [obsInterna, setObsInterna] = useState('');
  const [obsCliente, setObsCliente] = useState('');

  // Modal de inventario
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedPart, setSelectedPart] = useState<RepuestoResponse | null>(null);
  const [partQty, setPartQty] = useState('1');
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualQty, setManualQty] = useState('1');

  // Evidencias: input de archivo oculto por álbum
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadAlbumId, setUploadAlbumId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const cotizacionActual: CotizacionResponse | null = cotizaciones.length > 0
    ? [...cotizaciones].sort((a, b) => b.version - a.version)[0]
    : null;

  const montoRepuestosDiagnostico = diagnostico
    ? diagnostico.repuestos.reduce((total, repuesto) => total + Number(repuesto.subtotal ?? 0), 0)
    : 0;

  // El diagnóstico y sus repuestos solo se bloquean con cotización ENVIADA (el cliente la evalúa)
  // o APROBADA (compromiso cerrado); con PENDIENTE/RECHAZADA/VENCIDA/CANCELADA se pueden ajustar
  // para preparar la siguiente versión.
  const diagnosticoBloqueado = cotizacionActual?.estado === 'ENVIADA' || cotizacionActual?.estado === 'APROBADA';

  const estadosOrdenados = [...estados].sort((a, b) => a.orden - b.orden);
  const estadoActualIdx = orden ? estadosOrdenados.findIndex((e) => e.id === orden.idEstado) : -1;
  const siguienteEstado = estadoActualIdx >= 0 && estadoActualIdx < estadosOrdenados.length - 1
    ? estadosOrdenados[estadoActualIdx + 1]
    : null;

  const aplicarDiagnostico = (diag: DiagnosticoResponse | null, ordenActual: OrdenTrabajoResponse | null) => {
    setDiagnostico(diag);
    setDiagTecnicoId(diag ? String(diag.tecnicoId) : ordenActual?.idTecnico ? String(ordenActual.idTecnico) : '');
    setDiagProblema(diag?.problemaEncontrado ?? '');
    setDiagCausa(diag?.causaRaiz ?? '');
    setDiagTiempo(diag?.tiempoEstimadoHoras !== null && diag?.tiempoEstimadoHoras !== undefined ? String(diag.tiempoEstimadoHoras) : '');
    setDiagComplejidad(diag?.complejidad ?? '');
    setDiagObs(diag?.observacionesAdicionales ?? '');
  };

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      if (!Number.isFinite(ordenId)) {
        setLoadError('Orden inválida.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError('');

      try {
        const cachedUser = authService.getCachedUser();
        const currentUser = cachedUser ?? await authService.getCurrentUser();
        if (!isMounted) return;
        setUser(currentUser);

        const ordenData = await ordenesService.obtenerPorId(currentUser.empresaId, ordenId);
        if (!isMounted) return;
        setOrden(ordenData);

        const [estadosR, diagR, cotR, eviR, albR, tecR, invR] = await Promise.allSettled([
          ordenesService.listarEstados(),
          diagnosticosService.obtenerPorOrden(ordenId),
          cotizacionesService.listarPorOrden(ordenId),
          evidenciasService.listarPorOrden(ordenId),
          evidenciasService.listarAlbumes(),
          tecnicosService.listar(),
          repuestosService.listar(),
        ]);

        if (!isMounted) return;

        if (estadosR.status === 'fulfilled') setEstados(estadosR.value);
        if (diagR.status === 'fulfilled') aplicarDiagnostico(diagR.value, ordenData);
        if (cotR.status === 'fulfilled') {
          setCotizaciones(cotR.value);
          const ultima = cotR.value.length > 0 ? [...cotR.value].sort((a, b) => b.version - a.version)[0] : null;
          setManoObra(ultima ? String(ultima.montoManoObra) : '');
          setObsInterna(ultima?.observacionInterna ?? '');
        }
        if (eviR.status === 'fulfilled') setEvidencias(eviR.value);
        if (albR.status === 'fulfilled') setAlbumes(albR.value);
        if (tecR.status === 'fulfilled') setTecnicos(tecR.value);
        if (invR.status === 'fulfilled') setInventario(invR.value);
      } catch {
        if (isMounted) setLoadError('No se pudo cargar la orden. Verifica que exista y que el backend esté activo.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadAll();

    return () => {
      isMounted = false;
    };
  }, [ordenId]);

  const feedback = (ok: string) => {
    setActionOk(ok);
    setActionError('');
  };

  const fallo = (mensaje: string) => {
    setActionError(mensaje);
    setActionOk('');
  };

  const refrescarDiagnostico = async () => {
    const diag = await diagnosticosService.obtenerPorOrden(ordenId);
    aplicarDiagnostico(diag, orden);
  };

  const refrescarCotizaciones = async () => {
    const lista = await cotizacionesService.listarPorOrden(ordenId);
    setCotizaciones(lista);
    const ultima = lista.length > 0 ? [...lista].sort((a, b) => b.version - a.version)[0] : null;
    if (ultima) {
      setManoObra(String(ultima.montoManoObra));
      setObsInterna(ultima.observacionInterna ?? '');
    }
  };

  // ---- Estado de reparación (flujo operativo) ----
  const normalizarNombre = (texto: string) =>
    texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  const cambiarEstadoOrden = async (estadoId: number, comentario: string) => {
    if (!user || !orden || orden.idEstado === estadoId) return;
    const actualizada = await ordenesService.cambiarEstado(user.empresaId, orden.idOrden, {
      estadoNuevoId: estadoId,
      comentario,
    });
    setOrden(actualizada);
  };

  // Avanza el flujo automáticamente al completar un hito, buscando el estado por nombre
  // entre los configurados por la empresa. Nunca retrocede y nunca rompe el hito principal.
  const avanzarEstadoPorHito = async (candidatos: string[], comentario: string) => {
    if (!orden) return;
    const idxDestino = estadosOrdenados.findIndex((e) => candidatos.includes(normalizarNombre(e.nombre)));
    if (idxDestino < 0 || estadosOrdenados[idxDestino].id === orden.idEstado) return;
    if (estadoActualIdx >= 0 && idxDestino <= estadoActualIdx) return;
    try {
      await cambiarEstadoOrden(estadosOrdenados[idxDestino].id, comentario);
    } catch {
      // El hito principal ya se completó; el avance del flujo es secundario.
    }
  };

  // Completa en el backend los estados estándar que falten (idempotente) y refresca el timeline.
  const handleInicializarEstados = async () => {
    setIsSaving(true);
    try {
      const flujo = await ordenesService.inicializarEstados();
      setEstados(flujo);
      feedback('Flujo operativo completado con los estados estándar.');
    } catch {
      fallo('No se pudo inicializar el flujo de estados.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeleccionarEstado = async (estado: EstadoReparacionResponse) => {
    if (!orden || estado.id === orden.idEstado || isSaving) return;
    if (!window.confirm(`¿Mover la orden al estado "${estado.nombre}"?`)) return;
    setIsSaving(true);
    try {
      await cambiarEstadoOrden(estado.id, 'Estado actualizado desde el flujo operativo');
      feedback(`La orden pasó al estado "${estado.nombre}".`);
    } catch {
      fallo('No se pudo actualizar el estado de la orden.');
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Acciones: Información ----
  const handleAvanzarEstado = async () => {
    if (!user || !orden || !siguienteEstado) return;
    setIsSaving(true);
    try {
      await cambiarEstadoOrden(siguienteEstado.id, 'Avance de estado desde el detalle de la orden');
      feedback(`La orden avanzó al estado "${siguienteEstado.nombre}".`);
    } catch {
      fallo('No se pudo avanzar el estado de la orden.');
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Acciones: Diagnóstico ----
  const handleGuardarDiagnostico = async () => {
    if (!user || !orden) return;
    if (!diagProblema.trim()) {
      fallo('El problema encontrado es obligatorio.');
      return;
    }

    setIsSaving(true);
    try {
      const tiempo = diagTiempo.trim() === '' ? null : Number(diagTiempo);
      const base = {
        ordenId: orden.idOrden,
        problemaEncontrado: diagProblema.trim(),
        causaRaiz: diagCausa.trim() || undefined,
        tiempoEstimadoHoras: tiempo,
        complejidad: diagComplejidad === '' ? null : diagComplejidad,
        observacionesAdicionales: diagObs.trim() || undefined,
      };

      if (diagnostico) {
        await diagnosticosService.editar(diagnostico.id, { ...base, tecnicoId: diagnostico.tecnicoId });
        feedback('Diagnóstico actualizado.');
      } else {
        if (diagTecnicoId === '') {
          fallo('Selecciona el técnico responsable del diagnóstico.');
          setIsSaving(false);
          return;
        }
        const tecnicoId = Number(diagTecnicoId);
        if (orden.idTecnico !== tecnicoId) {
          const ordenActualizada = await ordenesService.cambiarTecnico(user.empresaId, orden.idOrden, tecnicoId);
          setOrden(ordenActualizada);
        }
        await diagnosticosService.crear({ ...base, tecnicoId });
        feedback('Diagnóstico registrado.');
        await avanzarEstadoPorHito(['diagnostico'], 'Diagnóstico técnico registrado');
      }
      await refrescarDiagnostico();
    } catch {
      fallo('No se pudo guardar el diagnóstico. Revisa el técnico asignado y los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  // Si hay un borrador PENDIENTE, lo re-guarda para que el backend recalcule los montos
  // con los repuestos actuales; así el total de la cotización nunca queda desfasado.
  const sincronizarCotizacionBorrador = async () => {
    if (!user || !orden || !diagnostico || !cotizacionActual || cotizacionActual.estado !== 'PENDIENTE') return;
    try {
      await cotizacionesService.editarBorrador(cotizacionActual.id, {
        ordenId: orden.idOrden,
        diagnosticoId: diagnostico.id,
        usuarioCreadorId: user.id,
        version: cotizacionActual.version,
        montoManoObra: cotizacionActual.montoManoObra,
        montoRepuestos: cotizacionActual.montoRepuestos,
        montoTotal: cotizacionActual.montoTotal,
        tiempoEstimadoHoras: diagnostico.tiempoEstimadoHoras,
        observacionInterna: cotizacionActual.observacionInterna ?? undefined,
      });
      await refrescarCotizaciones();
    } catch {
      // Secundario: los montos también se recalculan al guardar el borrador manualmente.
    }
  };

  const handleAgregarRepuestoInventario = async () => {
    if (!diagnostico || !selectedPart) return;
    const cantidad = Math.max(1, Number(partQty) || 1);
    setIsSaving(true);
    try {
      await diagnosticosService.agregarRepuesto(diagnostico.id, {
        repuestoId: selectedPart.id,
        nombreRepuesto: selectedPart.nombre,
        cantidad,
        precioUnitario: Number(selectedPart.precioVenta),
      });
      await refrescarDiagnostico();
      await sincronizarCotizacionBorrador();
      setIsInventoryModalOpen(false);
      setSelectedPart(null);
      setPartQty('1');
      feedback('Repuesto agregado al diagnóstico.');
    } catch {
      fallo('No se pudo agregar el repuesto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAgregarRepuestoManual = async () => {
    if (!diagnostico) return;
    if (!manualName.trim()) {
      fallo('Escribe el nombre del repuesto manual.');
      return;
    }
    const cantidad = Math.max(1, Number(manualQty) || 1);
    const precio = Math.max(0, Number(manualPrice) || 0);
    setIsSaving(true);
    try {
      await diagnosticosService.agregarRepuesto(diagnostico.id, {
        nombreRepuesto: manualName.trim(),
        cantidad,
        precioUnitario: precio,
      });
      await refrescarDiagnostico();
      await sincronizarCotizacionBorrador();
      setIsInventoryModalOpen(false);
      setManualName('');
      setManualPrice('');
      setManualQty('1');
      feedback('Repuesto agregado al diagnóstico.');
    } catch {
      fallo('No se pudo agregar el repuesto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEliminarRepuesto = async (repuestoDiagnosticoId: number) => {
    setIsSaving(true);
    try {
      await diagnosticosService.eliminarRepuesto(repuestoDiagnosticoId);
      await refrescarDiagnostico();
      await sincronizarCotizacionBorrador();
      feedback('Repuesto eliminado.');
    } catch {
      fallo('No se pudo eliminar el repuesto.');
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Acciones: Cotización ----
  const handleGenerarCotizacion = async () => {
    if (!user || !orden || !diagnostico) return;
    const mano = Number(manoObra);
    if (!Number.isFinite(mano) || mano < 0) {
      fallo('Ingresa un monto de mano de obra válido.');
      return;
    }
    setIsSaving(true);
    try {
      await cotizacionesService.generar({
        ordenId: orden.idOrden,
        diagnosticoId: diagnostico.id,
        usuarioCreadorId: user.id,
        version: 1,
        montoManoObra: mano,
        montoRepuestos: montoRepuestosDiagnostico,
        montoTotal: mano + montoRepuestosDiagnostico,
        tiempoEstimadoHoras: diagnostico.tiempoEstimadoHoras,
        observacionInterna: obsInterna.trim() || undefined,
      });
      await refrescarCotizaciones();
      feedback('Cotización generada.');
      await avanzarEstadoPorHito(['cotizacion'], 'Cotización generada');
    } catch {
      fallo('No se pudo generar la cotización. Verifica que no exista una versión activa.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGuardarBorrador = async () => {
    if (!user || !orden || !diagnostico || !cotizacionActual) return;
    const mano = Number(manoObra);
    if (!Number.isFinite(mano) || mano < 0) {
      fallo('Ingresa un monto de mano de obra válido.');
      return;
    }
    setIsSaving(true);
    try {
      await cotizacionesService.editarBorrador(cotizacionActual.id, {
        ordenId: orden.idOrden,
        diagnosticoId: diagnostico.id,
        usuarioCreadorId: user.id,
        version: cotizacionActual.version,
        montoManoObra: mano,
        montoRepuestos: montoRepuestosDiagnostico,
        montoTotal: mano + montoRepuestosDiagnostico,
        tiempoEstimadoHoras: diagnostico.tiempoEstimadoHoras,
        observacionInterna: obsInterna.trim() || undefined,
      });
      await refrescarCotizaciones();
      feedback('Borrador de cotización actualizado.');
    } catch {
      fallo('No se pudo actualizar el borrador (solo se editan cotizaciones pendientes).');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnviarCotizacion = async () => {
    if (!cotizacionActual) return;
    setIsSaving(true);
    try {
      await cotizacionesService.enviar(cotizacionActual.id);
      await refrescarCotizaciones();
      feedback('Cotización enviada al cliente.');
    } catch {
      fallo('No se pudo enviar la cotización.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDecisionCotizacion = async (estado: 'APROBADA' | 'RECHAZADA') => {
    if (!cotizacionActual) return;
    setIsSaving(true);
    try {
      await cotizacionesService.registrarDecision(cotizacionActual.id, {
        estado,
        observacionCliente: obsCliente.trim() || undefined,
      });
      await refrescarCotizaciones();
      setObsCliente('');
      feedback(estado === 'APROBADA' ? 'Cotización marcada como aprobada.' : 'Cotización marcada como rechazada.');
      if (estado === 'APROBADA') {
        await avanzarEstadoPorHito(['aprobado', 'aprobada'], 'Cotización aprobada por el cliente');
      }
    } catch {
      fallo('No se pudo registrar la decisión.');
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Acciones: Evidencia ----
  const handleSeleccionarFoto = (albumId: number) => {
    setUploadAlbumId(albumId);
    fileInputRef.current?.click();
  };

  const handleArchivoSeleccionado = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo || uploadAlbumId === null || !orden) return;

    setIsUploading(true);
    try {
      const subido = await evidenciasService.subirArchivo(archivo);
      await evidenciasService.registrar({
        ordenId: orden.idOrden,
        albumId: uploadAlbumId,
        usuarioSubidaId: user?.id,
        urlImagen: subido.url,
        descripcion: subido.nombreOriginal,
      });
      setEvidencias(await evidenciasService.listarPorOrden(orden.idOrden));
      feedback('Evidencia fotográfica registrada.');
    } catch {
      fallo('No se pudo subir la evidencia (solo .jpg y .png, máximo 10MB).');
    } finally {
      setIsUploading(false);
      setUploadAlbumId(null);
    }
  };

  const filteredInventory = inventario.filter((item) =>
    item.nombre.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    (item.codigo ?? '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
    (item.marca ?? '').toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const tabButton = (tab: 'info' | 'diag' | 'cot' | 'evi', icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveSubTab(tab)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '700',
        backgroundColor: activeSubTab === tab ? '#EDE9FE' : 'transparent',
        color: activeSubTab === tab ? '#3730A3' : '#64748B',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <DashboardLayout title="Órdenes" subtitle="" role="admin">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>

        {isLoading && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '700' }}>
            Cargando detalle de la orden...
          </Card>
        )}

        {loadError && (
          <Card hoverable={false} style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '700' }}>
            {loadError}
          </Card>
        )}

        {orden && (
          <>
            {/* Ticket Header Banner */}
            <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>{orden.numeroOrden}</span>
                    <span className="badge badge-purple" style={{ backgroundColor: '#EDE9FE', color: orden.colorHexEstado ?? '#3730A3' }}>
                      • {orden.nombreEstado}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#3730A3', marginBottom: '12px' }}>
                    {orden.dispositivoResumen || 'Dispositivo sin detalle'}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={16} color="#6366F1" /> <span>{orden.nombreCliente}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Wrench size={16} color="#6366F1" /> <span>{orden.nombreTecnico ?? 'Sin asignar'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} color="#6366F1" /> <span>Ingreso: {formatDate(orden.fechaIngreso)}</span>
                    </div>
                  </div>
                </div>

                <Link to="/ordenes" style={{ color: '#3730A3' }}>
                  <ArrowLeft size={24} />
                </Link>
              </div>
            </Card>

            {/* Sub Navigation Bar */}
            <Card hoverable={false} style={{ padding: '8px 16px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {tabButton('info', <Info size={18} />, 'Información')}
                {tabButton('diag', <Stethoscope size={18} />, 'Diagnóstico')}
                {tabButton('cot', <FileText size={18} />, 'Cotización')}
                {tabButton('evi', <Camera size={18} />, 'Evidencia')}
              </div>
            </Card>

            {actionError && (
              <Card hoverable={false} style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#991B1B', fontWeight: '600', fontSize: '13px' }}>
                {actionError}
              </Card>
            )}
            {actionOk && (
              <Card hoverable={false} style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#166534', fontWeight: '600', fontSize: '13px' }}>
                {actionOk}
              </Card>
            )}

            {/* Main Content Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '24px' }}>

              {/* Left Dynamic Tab Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* 1. INFORMACIÓN */}
                {activeSubTab === 'info' && (
                  <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Detalles Generales del Ticket
                    </h3>

                    <div className="grid-2">
                      <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>CLIENTE</span>
                        <strong style={{ fontSize: '15px', color: '#1E1B4B' }}>{orden.nombreCliente}</strong>
                        <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>Seguimiento: {orden.codigoSeguimiento}</span>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>DISPOSITIVO</span>
                        <strong style={{ fontSize: '15px', color: '#1E1B4B' }}>{orden.dispositivoResumen || 'Sin detalle'}</strong>
                        <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>ID dispositivo: {orden.idDispositivo}</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>DAÑO REPORTADO</span>
                      <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                        "{orden.problemaReportado}"
                      </p>
                    </div>

                    {orden.observaciones && (
                      <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>OBSERVACIONES</span>
                        <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>{orden.observaciones}</p>
                      </div>
                    )}

                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
                        Estructura de precios:
                      </span>
                      {cotizacionActual ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Costo de Repuestos:</span>
                            <strong style={{ color: '#1E1B4B' }}>{formatMoney(cotizacionActual.montoRepuestos)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Costo de mano de Obra / Reparación:</span>
                            <strong style={{ color: '#1E1B4B' }}>{formatMoney(cotizacionActual.montoManoObra)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#3730A3', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                            <span>Monto total ({ESTADO_COTIZACION_LABEL[cotizacionActual.estado] ?? cotizacionActual.estado}):</span>
                            <span>{formatMoney(cotizacionActual.montoTotal)}</span>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                          Aún no hay cotización para esta orden. Genera el diagnóstico y la cotización en sus pestañas.
                        </p>
                      )}
                    </div>

                    {siguienteEstado && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <Button variant="primary" style={{ backgroundColor: '#3730A3' }} disabled={isSaving} onClick={handleAvanzarEstado}>
                          Avanzar a: {siguienteEstado.nombre}
                        </Button>
                      </div>
                    )}
                  </Card>
                )}

                {/* 2. DIAGNÓSTICO */}
                {activeSubTab === 'diag' && (
                  <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                        Diagnóstico Técnico
                      </h3>
                      <span style={{ fontSize: '13px', color: '#6366F1', fontWeight: '600' }}>
                        {orden.numeroOrden} · {orden.nombreCliente} · {orden.dispositivoResumen}
                      </span>
                    </div>

                    {diagnosticoBloqueado && (
                      <div style={{ backgroundColor: '#FFFBEB', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#92400E', fontWeight: '600' }}>
                        {cotizacionActual?.estado === 'ENVIADA'
                          ? 'La cotización está enviada al cliente: el diagnóstico y sus repuestos quedan bloqueados hasta recibir respuesta.'
                          : 'La cotización fue aprobada: el diagnóstico y sus repuestos ya no pueden modificarse.'}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>

                      {/* Hallazgos del técnico */}
                      <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B' }}>Hallazgos del técnico</span>

                        <div className="input-group">
                          <label className="input-label">Técnico responsable</label>
                          <select
                            className="input-field"
                            value={diagTecnicoId}
                            onChange={(e) => setDiagTecnicoId(e.target.value)}
                            disabled={diagnostico !== null}
                          >
                            <option value="">-- Seleccionar técnico --</option>
                            {tecnicos.filter((t) => t.activo).map((t) => (
                              <option key={t.idTecnico} value={String(t.idTecnico)}>{t.nombre} {t.apellido}</option>
                            ))}
                          </select>
                        </div>

                        <Input
                          label="Problema encontrado *"
                          placeholder="Ej. El equipo no enciende, no carga al conectar..."
                          value={diagProblema}
                          onChange={(e) => setDiagProblema(e.target.value)}
                          disabled={diagnosticoBloqueado}
                        />
                        <Input
                          label="Causa Raíz"
                          placeholder="Ej. Conector USB-C dañado por uso excesivo..."
                          value={diagCausa}
                          onChange={(e) => setDiagCausa(e.target.value)}
                          disabled={diagnosticoBloqueado}
                        />

                        <div className="grid-2">
                          <Input
                            label="Tiempo estimado (horas)"
                            type="number"
                            min={0}
                            step="0.5"
                            placeholder="Ej. 4"
                            value={diagTiempo}
                            onChange={(e) => setDiagTiempo(e.target.value)}
                            disabled={diagnosticoBloqueado}
                          />
                          <div className="input-group">
                            <label className="input-label">Nivel de complejidad</label>
                            <select
                              className="input-field"
                              value={diagComplejidad}
                              onChange={(e) => setDiagComplejidad(e.target.value as '' | ComplejidadDiagnostico)}
                              disabled={diagnosticoBloqueado}
                            >
                              <option value="">-- Sin definir --</option>
                              <option value="BAJA">Baja</option>
                              <option value="MEDIA">Media</option>
                              <option value="ALTA">Alta</option>
                            </select>
                          </div>
                        </div>

                        <div className="input-group">
                          <label className="input-label">Observaciones adicionales</label>
                          <textarea
                            className="input-field"
                            rows={2}
                            value={diagObs}
                            onChange={(e) => setDiagObs(e.target.value)}
                            disabled={diagnosticoBloqueado}
                          />
                        </div>
                      </div>

                      {/* Resumen Económico + SLA */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
                            Resumen Económico
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                              <span>Repuestos ({diagnostico?.repuestos.length ?? 0})</span>
                              <strong>{formatMoney(montoRepuestosDiagnostico)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                              <span>Tiempo estimado</span>
                              <strong>{diagnostico?.tiempoEstimadoHoras != null ? `${diagnostico.tiempoEstimadoHoras} h` : '—'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                              <span>Complejidad</span>
                              <strong>{diagnostico?.complejidad ?? '—'}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ backgroundColor: '#EDE9FE', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#3730A3' }}>
                          <strong>⏱ SLA:</strong> Una vez aprobada la cotización, la reparación inicia en menos de 4 horas hábiles.
                        </div>
                      </div>

                    </div>

                    {/* Repuestos Requeridos */}
                    <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                            Repuestos requeridos
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            {!diagnostico
                              ? 'Guarda primero el diagnóstico para agregar repuestos'
                              : diagnosticoBloqueado
                                ? 'Repuestos bloqueados por el estado de la cotización'
                                : 'Selecciona directamente del inventario del taller'}
                          </span>
                        </div>

                        <button
                          onClick={() => setIsInventoryModalOpen(true)}
                          disabled={!diagnostico || diagnosticoBloqueado}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '700',
                            backgroundColor: diagnostico && !diagnosticoBloqueado ? '#3730A3' : '#CBD5E1',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: diagnostico && !diagnosticoBloqueado ? 'pointer' : 'not-allowed'
                          }}
                        >
                          <Plus size={16} /> Agregar Repuesto
                        </button>
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#EDE9FE', color: '#3730A3' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left' }}>REPUESTO</th>
                            <th style={{ padding: '8px 12px', textAlign: 'center' }}>CANT.</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right' }}>PRECIO</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right' }}>SUBTOTAL</th>
                            <th style={{ padding: '8px 12px', textAlign: 'center' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(diagnostico?.repuestos ?? []).map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                              <td style={{ padding: '10px 12px', fontWeight: '600' }}>{p.nombreRepuesto}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>{p.cantidad}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatMoney(p.precioUnitario)}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700' }}>{formatMoney(p.subtotal)}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <button
                                  onClick={() => handleEliminarRepuesto(p.id)}
                                  disabled={isSaving || diagnosticoBloqueado}
                                  style={{
                                    color: diagnosticoBloqueado ? '#CBD5E1' : '#EF4444',
                                    background: 'none',
                                    border: 'none',
                                    cursor: diagnosticoBloqueado ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {(diagnostico?.repuestos ?? []).length === 0 && (
                            <tr>
                              <td colSpan={5} style={{ padding: '14px 12px', textAlign: 'center', color: '#94A3B8' }}>
                                Sin repuestos registrados.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <Button variant="outline" disabled={isSaving || diagnosticoBloqueado} onClick={handleGuardarDiagnostico}>
                        {diagnostico ? 'Guardar cambios' : 'Guardar diagnóstico'}
                      </Button>
                      <Button
                        variant="primary"
                        style={{ backgroundColor: '#3730A3' }}
                        disabled={!diagnostico}
                        onClick={() => setActiveSubTab('cot')}
                      >
                        Ir a cotización
                      </Button>
                    </div>
                  </Card>
                )}

                {/* 3. COTIZACIÓN */}
                {activeSubTab === 'cot' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                          {cotizacionActual ? `Cotización V${cotizacionActual.version}` : 'Nueva Cotización'}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                          Propuesta comercial • {orden.nombreCliente} • {formatDate(cotizacionActual?.fechaCreacion ?? orden.fechaIngreso)}
                        </p>
                      </div>
                    </div>

                    {!diagnostico ? (
                      <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', color: '#94A3B8', fontSize: '14px' }}>
                        Para generar una cotización primero registra el diagnóstico técnico de la orden.
                      </Card>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

                        {/* Quote Invoice Card */}
                        <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '16px' }}>
                            <div>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>COTIZACIÓN</span>
                              <span style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B' }}>
                                {cotizacionActual ? `${orden.numeroOrden} · V${cotizacionActual.version}` : `${orden.numeroOrden} · Borrador`}
                              </span>
                              {cotizacionActual?.fechaEnvio && (
                                <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Enviada el {formatDate(cotizacionActual.fechaEnvio)}</span>
                              )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3' }}>{orden.nombreCliente}</span>
                              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>{orden.dispositivoResumen}</span>
                              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Seguimiento: {orden.codigoSeguimiento}</span>
                            </div>
                          </div>

                          {/* Items Table */}
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#F8FAFC', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>REPUESTO</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>CANT.</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>PRECIO</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>SUBTOTAL</th>
                              </tr>
                            </thead>
                            <tbody>
                              {diagnostico.repuestos.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                  <td style={{ padding: '8px', fontWeight: '600' }}>{p.nombreRepuesto}</td>
                                  <td style={{ padding: '8px', textAlign: 'center' }}>{p.cantidad}</td>
                                  <td style={{ padding: '8px', textAlign: 'right' }}>{formatMoney(p.precioUnitario)}</td>
                                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: '700' }}>{formatMoney(p.subtotal)}</td>
                                </tr>
                              ))}
                              {diagnostico.repuestos.length === 0 && (
                                <tr>
                                  <td colSpan={4} style={{ padding: '12px 8px', textAlign: 'center', color: '#94A3B8' }}>
                                    Sin repuestos en el diagnóstico.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          {/* Subtotals & Total */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right', fontSize: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                            {/* Con cotización ENVIADA/APROBADA se muestran los montos congelados de esa
                                cotización; mientras sea editable, los montos se calculan en vivo con los
                                repuestos actuales del diagnóstico. */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                              <span>Subtotal repuestos</span>
                              <span>{formatMoney(diagnosticoBloqueado && cotizacionActual ? cotizacionActual.montoRepuestos : montoRepuestosDiagnostico)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                              <span>Mano de obra</span>
                              <span>{formatMoney(diagnosticoBloqueado && cotizacionActual ? cotizacionActual.montoManoObra : Number(manoObra) || 0)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#1E1B4B', marginTop: '6px' }}>
                              <span>TOTAL</span>
                              <span>{formatMoney(diagnosticoBloqueado && cotizacionActual ? cotizacionActual.montoTotal : (Number(manoObra) || 0) + montoRepuestosDiagnostico)}</span>
                            </div>
                          </div>

                          {/* Terms Note */}
                          <div style={{ backgroundColor: '#EDE9FE', borderRadius: '10px', padding: '10px 14px', marginTop: '16px', fontSize: '11px', color: '#3730A3' }}>
                            <strong>Términos:</strong> Garantía de 90 días sobre los repuestos instalados. La aprobación de esta cotización autoriza al taller a iniciar las reparaciones descritas.
                          </div>
                        </Card>

                        {/* Status and Action Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                          {/* Estado */}
                          <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
                              Estado de la cotización
                            </span>
                            <div style={{ backgroundColor: '#EDE9FE', padding: '10px 14px', borderRadius: '10px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3', display: 'block' }}>
                                {cotizacionActual ? (ESTADO_COTIZACION_LABEL[cotizacionActual.estado] ?? cotizacionActual.estado) : 'Sin generar'}
                              </span>
                              {cotizacionActual?.fechaRespuesta && (
                                <span style={{ fontSize: '11px', color: '#6366F1' }}>Respuesta: {formatDate(cotizacionActual.fechaRespuesta)}</span>
                              )}
                              {cotizacionActual?.observacionCliente && (
                                <span style={{ fontSize: '11px', color: '#6366F1', display: 'block' }}>"{cotizacionActual.observacionCliente}"</span>
                              )}
                            </div>
                            {cotizaciones.length > 1 && (
                              <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginTop: '8px' }}>
                                Versiones registradas: {[...cotizaciones].sort((a, b) => a.version - b.version).map((c) => `V${c.version}`).join(' · ')}
                              </span>
                            )}
                          </Card>

                          {/* Borrador / Generar */}
                          {(!cotizacionActual || cotizacionActual.estado === 'PENDIENTE'
                            || cotizacionActual.estado === 'RECHAZADA' || cotizacionActual.estado === 'VENCIDA' || cotizacionActual.estado === 'CANCELADA') && (
                            <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
                                {cotizacionActual && cotizacionActual.estado === 'PENDIENTE' ? 'Editar borrador' : 'Generar cotización'}
                              </span>
                              <Input
                                label="MANO DE OBRA (L.)"
                                type="number"
                                min={0}
                                step="0.01"
                                placeholder="Ej. 500"
                                value={manoObra}
                                onChange={(e) => setManoObra(e.target.value)}
                              />
                              <div className="input-group">
                                <label className="input-label">OBSERVACIÓN INTERNA</label>
                                <textarea
                                  className="input-field"
                                  rows={2}
                                  value={obsInterna}
                                  onChange={(e) => setObsInterna(e.target.value)}
                                  maxLength={500}
                                />
                              </div>
                              {cotizacionActual && cotizacionActual.estado === 'PENDIENTE' ? (
                                <>
                                  <Button variant="outline" size="sm" style={{ width: '100%', borderRadius: '10px' }} disabled={isSaving} onClick={handleGuardarBorrador}>
                                    Guardar borrador
                                  </Button>
                                  <Button variant="primary" size="sm" style={{ width: '100%', backgroundColor: '#3730A3', borderRadius: '10px' }} disabled={isSaving} icon={<Send size={16} />} onClick={handleEnviarCotizacion}>
                                    Enviar al cliente
                                  </Button>
                                </>
                              ) : (
                                <Button variant="primary" size="sm" style={{ width: '100%', backgroundColor: '#3730A3', borderRadius: '10px' }} disabled={isSaving} onClick={handleGenerarCotizacion}>
                                  {cotizacionActual ? 'Generar nueva versión' : 'Generar cotización'}
                                </Button>
                              )}
                            </Card>
                          )}

                          {/* Decisión manual */}
                          {cotizacionActual?.estado === 'ENVIADA' && (
                            <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
                                Decisión del cliente
                              </span>
                              <Input
                                placeholder="Observación del cliente (opcional)"
                                value={obsCliente}
                                onChange={(e) => setObsCliente(e.target.value)}
                                maxLength={500}
                              />
                              <Button variant="primary" size="sm" style={{ width: '100%', backgroundColor: '#3730A3', borderRadius: '10px' }} disabled={isSaving} icon={<CheckCircle size={16} />} onClick={() => handleDecisionCotizacion('APROBADA')}>
                                Marcar como aprobada
                              </Button>
                              <Button variant="outline" size="sm" style={{ width: '100%', color: '#EF4444', borderColor: '#FCA5A5', borderRadius: '10px' }} disabled={isSaving} icon={<XCircle size={16} />} onClick={() => handleDecisionCotizacion('RECHAZADA')}>
                                Marcar como rechazada
                              </Button>
                            </Card>
                          )}

                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 4. EVIDENCIA */}
                {activeSubTab === 'evi' && (
                  <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      onChange={handleArchivoSeleccionado}
                    />

                    {isUploading && (
                      <div style={{ backgroundColor: '#EEF2FF', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#3730A3', fontWeight: '700' }}>
                        Subiendo evidencia...
                      </div>
                    )}

                    {albumes.map((album) => {
                      const fotos = evidencias.filter((e) => e.albumId === album.id);
                      return (
                        <div key={album.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                                {album.titulo}{album.obligatorio ? ' *' : ''}
                              </h3>
                              <span style={{ fontSize: '12px', color: '#64748B' }}>{album.descripcion}</span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Camera size={16} />}
                              disabled={isUploading}
                              onClick={() => handleSeleccionarFoto(album.id)}
                            >
                              Agregar foto
                            </Button>
                          </div>

                          <div className="grid-4">
                            {fotos.map((foto) => (
                              <div key={foto.id} style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', backgroundColor: '#FAFAFD' }}>
                                <img
                                  src={evidenciasService.resolverUrlImagen(foto.urlImagen)}
                                  alt={foto.descripcion ?? foto.etiqueta ?? 'Evidencia'}
                                  style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{ padding: '6px 10px' }}>
                                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {foto.descripcion ?? foto.etiqueta ?? formatDate(foto.fechaSubida)}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {fotos.length === 0 && (
                              <div style={{ border: '1px dashed #CBD5E1', borderRadius: '14px', height: '120px', backgroundColor: '#FAFAFD', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Camera size={22} color="#64748B" />
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Sin fotos</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {albumes.length === 0 && (
                      <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                        No se pudieron cargar los álbumes de evidencia.
                      </p>
                    )}
                  </Card>
                )}

              </div>

              {/* Right Column: Flujo Operativo Timeline con estados reales */}
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF', alignSelf: 'start' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  Flujo Operativo
                </h3>
                <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', margin: '4px 0 24px 0' }}>
                  Haz clic en una etapa para mover la orden a ese estado.
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                  {estadosOrdenados.map((estado, idx) => {
                    const completado = estadoActualIdx >= 0 && idx < estadoActualIdx;
                    const activo = estado.id === orden.idEstado;
                    return (
                      <div
                        key={estado.id}
                        onClick={() => void handleSeleccionarEstado(estado)}
                        title={activo ? 'Estado actual' : `Mover la orden a "${estado.nombre}"`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          opacity: completado || activo ? 1 : 0.5,
                          cursor: activo ? 'default' : 'pointer'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: activo ? '#1E1B4B' : completado ? '#A78BFA' : '#EDE9FE',
                          color: activo || completado ? '#FFFFFF' : '#3730A3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          flexShrink: 0
                        }}>
                          {completado ? <CheckCircle size={20} /> : idx + 1}
                        </div>
                        <span style={{
                          fontSize: '15px',
                          fontWeight: activo ? '800' : '700',
                          color: activo ? '#1E1B4B' : completado ? '#3730A3' : '#64748B'
                        }}>
                          {estado.nombre}
                        </span>
                      </div>
                    );
                  })}

                  {estadosOrdenados.length === 0 && (
                    <span style={{ fontSize: '13px', color: '#94A3B8' }}>No se pudieron cargar los estados.</span>
                  )}

                  {estadosOrdenados.length > 0 && estadosOrdenados.length < 4 && (
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#92400E', fontWeight: '600' }}>
                        Tu empresa tiene un flujo incompleto: faltan las etapas estándar del proceso de reparación.
                      </span>
                      <Button variant="outline" size="sm" disabled={isSaving} onClick={handleInicializarEstados}>
                        Completar flujo estándar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

            </div>
          </>
        )}

        {/* MODAL: Inventario del Taller */}
        {isInventoryModalOpen && diagnostico && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}>
            <Card hoverable={false} style={{ width: '100%', maxWidth: '580px', padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto' }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    Inventario del Taller
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>
                    Selecciona un repuesto para asignarlo a la orden
                  </span>
                </div>
                <button
                  onClick={() => { setIsInventoryModalOpen(false); setSelectedPart(null); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Bar */}
              <Input
                placeholder="Buscar por nombre, código o marca..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                icon={<Search size={18} />}
              />

              {/* Parts List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPart(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: selectedPart?.id === item.id ? '2px solid #3730A3' : '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="card-hover"
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#EDE9FE',
                      color: '#3730A3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Package size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                        {item.nombre}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        {item.codigo ?? 'Sin código'} · {item.stockActual} disponibles · <strong style={{ color: '#3730A3' }}>{formatMoney(item.precioVenta)}</strong>
                      </span>
                    </div>
                  </div>
                ))}

                {filteredInventory.length === 0 && (
                  <span style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '12px' }}>
                    No hay repuestos en el inventario (puedes agregarlo manualmente abajo).
                  </span>
                )}
              </div>

              {selectedPart && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <Input
                    label="CANTIDAD"
                    type="number"
                    min={1}
                    value={partQty}
                    onChange={(e) => setPartQty(e.target.value)}
                    style={{ width: '120px' }}
                  />
                  <Button variant="primary" size="sm" style={{ backgroundColor: '#3730A3' }} disabled={isSaving} onClick={handleAgregarRepuestoInventario}>
                    Agregar
                  </Button>
                </div>
              )}

              {/* Entrada manual */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
                  ¿No está en inventario? Agrégalo manualmente
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                  <Input
                    placeholder="Nombre del repuesto"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    maxLength={100}
                  />
                  <Input
                    placeholder="Precio"
                    type="number"
                    min={0}
                    step="0.01"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                  />
                  <Input
                    placeholder="Cant."
                    type="number"
                    min={1}
                    value={manualQty}
                    onChange={(e) => setManualQty(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" disabled={isSaving} onClick={handleAgregarRepuestoManual}>
                  Agregar repuesto manual
                </Button>
              </div>

            </Card>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
