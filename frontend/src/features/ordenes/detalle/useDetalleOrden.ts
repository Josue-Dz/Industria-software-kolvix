import { useEffect, useRef, useState } from 'react';
import { authService } from '../../../api/services/authService';
import { ordenesService } from '../../../api/services/ordenesService';
import { diagnosticosService } from '../../../api/services/diagnosticosService';
import { cotizacionesService } from '../../../api/services/cotizacionesService';
import { evidenciasService } from '../../../api/services/evidenciasService';
import { repuestosService } from '../../../api/services/repuestosService';
import { tecnicosService } from '../../../api/services/tecnicosService';
import { normalizarTexto } from '../../../utils/formato';
import { entregasService } from '../../../api/services/entregasService';
import type { EntregaResponse } from '../../../api/types';

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
import type { SubTab } from './shared';

// Toda la lógica (estado + acciones) del detalle de la orden. Las vistas de cada
// pestaña reciben este controlador y se limitan a renderizar.
export const useDetalleOrden = (ordenId: number) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('info');
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
  const [entrega, setEntrega] = useState<EntregaResponse | null>(null);
  const [isEntregaModalOpen, setIsEntregaModalOpen] = useState(false);
  const [entregaIdentidadVerificada, setEntregaIdentidadVerificada] = useState(false);
  const [entregaComprobante, setEntregaComprobante] = useState('');
  const [entregaObservaciones, setEntregaObservaciones] = useState('');

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

        const [estadosR, diagR, cotR, eviR, albR, tecR, invR, entR] = await Promise.allSettled([
          ordenesService.listarEstados(),
          diagnosticosService.obtenerPorOrden(ordenId),
          cotizacionesService.listarPorOrden(ordenId),
          evidenciasService.listarPorOrden(ordenId),
          evidenciasService.listarAlbumes(),
          // El listado completo de técnicos es solo para ADMIN/PROPIETARIO. Un
          // técnico recibiría 403 y se quedaría sin poder elegirse a sí mismo,
          // así que para ese rol se consulta únicamente su propio perfil.
          currentUser.rol === 'TECNICO'
            ? tecnicosService.obtenerMiPerfil().then((perfil) => [perfil])
            : tecnicosService.listar(),
          repuestosService.listar(),
          entregasService.obtenerPorOrden(currentUser.empresaId, ordenId), 
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
        if (tecR.status === 'fulfilled') {
          setTecnicos(tecR.value);
          // Al ser el único técnico posible, se deja elegido de entrada: sin esto
          // el campo quedaría vacío y deshabilitado, y no podría guardar.
          if (currentUser.rol === 'TECNICO' && tecR.value.length === 1) {
            setDiagTecnicoId(String(tecR.value[0].idTecnico));
          }
        }
        if (invR.status === 'fulfilled') setInventario(invR.value);
        if (entR.status === 'fulfilled') setEntrega(entR.value);
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
    const idxDestino = estadosOrdenados.findIndex((e) => candidatos.includes(normalizarTexto(e.nombre)));
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

  const handleRegistrarEntrega = async () => {
  if (!user || !orden) return;
  if (!entregaIdentidadVerificada) {
    fallo('Debes verificar la identidad del cliente antes de registrar la entrega.');
    return;
  }

  setIsSaving(true);
  try {
    const nuevaEntrega = await entregasService.registrar(user.empresaId, {
      ordenId: orden.idOrden,
      usuarioEntregaId: user.id,
      identidadVerificada: entregaIdentidadVerificada,
      urlComprobanteEntrega: entregaComprobante.trim() || undefined,
      observaciones: entregaObservaciones.trim() || undefined,
    });
    setEntrega(nuevaEntrega);
    setIsEntregaModalOpen(false);

    // Refresca la orden para traer fechaEntrega actualizada
    const ordenActualizada = await ordenesService.obtenerPorId(user.empresaId, orden.idOrden);
    setOrden(ordenActualizada);

    feedback('Entrega registrada correctamente.');
  } catch {
    fallo('No se pudo registrar la entrega. Verifica los datos.');
  } finally {
    setIsSaving(false);
  }
};

  // Si hay un borrador PENDIENTE, lo re-guarda para que el backend recalcule los montos
  // con los repuestos actuales; así el total de la cotización nunca queda desfasado.
  const sincronizarCotizacionBorrador = async () => {
    if (!user || !orden || !diagnostico || !cotizacionActual || cotizacionActual.estado !== 'PENDIENTE') return;
    // El técnico no puede editar cotizaciones (el backend responde 403): sus
    // montos los recalcula quien la administre al guardar el borrador.
    if (user.rol === 'TECNICO') return;
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

  return {
    // Datos
    activeSubTab, setActiveSubTab,
    orden, diagnostico, cotizaciones, cotizacionActual, evidencias, albumes, tecnicos,
    // Un técnico solo puede diagnosticar a su propio nombre.
    esTecnico: user?.rol === 'TECNICO',
    estadosOrdenados, estadoActualIdx, siguienteEstado,
    montoRepuestosDiagnostico, diagnosticoBloqueado,
    isLoading, loadError, actionError, actionOk, isSaving, isUploading,
    // Formulario diagnóstico
    diagTecnicoId, setDiagTecnicoId,
    diagProblema, setDiagProblema,
    diagCausa, setDiagCausa,
    diagTiempo, setDiagTiempo,
    diagComplejidad, setDiagComplejidad,
    diagObs, setDiagObs,
    // Cotización
    manoObra, setManoObra,
    obsInterna, setObsInterna,
    obsCliente, setObsCliente,
    // Modal inventario
    isInventoryModalOpen, setIsInventoryModalOpen,
    inventorySearch, setInventorySearch,
    selectedPart, setSelectedPart,
    partQty, setPartQty,
    manualName, setManualName,
    manualPrice, setManualPrice,
    manualQty, setManualQty,
    filteredInventory,
    // Evidencia
    fileInputRef,
    // Acciones
    handleAvanzarEstado,
    handleSeleccionarEstado,
    handleInicializarEstados,
    handleGuardarDiagnostico,
    handleAgregarRepuestoInventario,
    handleAgregarRepuestoManual,
    handleEliminarRepuesto,
    handleGenerarCotizacion,
    handleGuardarBorrador,
    handleEnviarCotizacion,
    handleDecisionCotizacion,
    handleSeleccionarFoto,
    handleArchivoSeleccionado,
    // Entrega
    entrega,
    isEntregaModalOpen, setIsEntregaModalOpen,
    entregaIdentidadVerificada, setEntregaIdentidadVerificada,
    entregaComprobante, setEntregaComprobante,
    entregaObservaciones, setEntregaObservaciones,
    handleRegistrarEntrega,
  };
};

export type DetalleOrdenController = ReturnType<typeof useDetalleOrden>;
