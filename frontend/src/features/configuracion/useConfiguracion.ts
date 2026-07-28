import { useCallback, useEffect, useState } from 'react';
import { empresaService } from '../../api/services/empresaService';
import { usuariosService } from '../../api/services/usuariosService';
import { estadosReparacionService } from '../../api/services/estadosReparacionService';
import { authService } from '../../api/services/authService';
import { getApiErrorMessage } from '../../api/apiError';
import type {
  CuentaCobroResponse,
  CuentaPagoTallerResponse,
  EmpresaResponse,
  EstadoReparacionResponse,
  PlanSuscripcionResponse,
  UsuarioResponse,
} from '../../api/types';

export type ConfigTab =
  | 'empresa'
  | 'usuarios'
  | 'roles'
  | 'estados'
  | 'suscripcion'
  | 'integraciones';

// Carga y acciones de la pantalla de configuración. Cada pestaña recibe este
// controlador y solo renderiza.
export const useConfiguracion = () => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('empresa');

  const [usuarioActual, setUsuarioActual] = useState<UsuarioResponse | null>(null);
  const [empresa, setEmpresa] = useState<EmpresaResponse | null>(null);
  const [planes, setPlanes] = useState<PlanSuscripcionResponse[]>([]);
  const [cuentasCobro, setCuentasCobro] = useState<CuentaCobroResponse[]>([]);
  const [cuentasPago, setCuentasPago] = useState<CuentaPagoTallerResponse[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [estados, setEstados] = useState<EstadoReparacionResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = useCallback((mensaje: string) => {
    setErrorMessage(null);
    setToastMessage(mensaje);
  }, []);

  const showError = useCallback((mensaje: string) => {
    setToastMessage(null);
    setErrorMessage(mensaje);
  }, []);

  useEffect(() => {
    if (!toastMessage && !errorMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
      setErrorMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage, errorMessage]);

  useEffect(() => {
    let isMounted = true;

    const cargar = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const cachedUser = authService.getCachedUser();
        const user = cachedUser ?? await authService.getCurrentUser();
        if (!isMounted) return;
        setUsuarioActual(user);

        const [empresaR, planesR, cobroR, pagoR, usuariosR, estadosR] = await Promise.allSettled([
          empresaService.obtener(),
          empresaService.listarPlanes(),
          empresaService.listarCuentasCobro(),
          empresaService.listarCuentasPago(),
          usuariosService.listar(),
          estadosReparacionService.listar(),
        ]);

        if (!isMounted) return;

        if (empresaR.status === 'fulfilled') {
          setEmpresa(empresaR.value);
        } else {
          setLoadError('No se pudieron cargar los datos de la empresa desde el backend.');
        }
        if (planesR.status === 'fulfilled') setPlanes(planesR.value);
        if (cobroR.status === 'fulfilled') setCuentasCobro(cobroR.value);
        if (pagoR.status === 'fulfilled') setCuentasPago(pagoR.value);
        if (usuariosR.status === 'fulfilled') setUsuarios(usuariosR.value);
        if (estadosR.status === 'fulfilled') setEstados(estadosR.value);
      } catch {
        if (isMounted) setLoadError('No se pudo cargar la configuración. Verifica que el backend esté activo.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void cargar();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---- Empresa ----
  const guardarEmpresa = async (datos: {
    nombre: string;
    rtn: string;
    telefono: string;
    correo: string;
    direccion: string;
  }) => {
    setIsSaving(true);
    try {
      const actualizada = await empresaService.actualizar({
        nombre: datos.nombre.trim(),
        rtn: datos.rtn.trim() || undefined,
        telefono: datos.telefono.trim() || undefined,
        correo: datos.correo.trim(),
        direccion: datos.direccion.trim() || undefined,
      });
      setEmpresa(actualizada);
      showToast('Datos de la empresa actualizados.');
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudieron guardar los datos de la empresa.'));
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Cuentas de pago del taller ----
  const agregarCuentaPago = async (cuenta: {
    banco: string;
    tipoCuenta: 'AHORRO' | 'CHEQUES' | 'OTRO';
    numeroCuenta: string;
    titular: string;
    moneda: string;
    instrucciones: string;
  }) => {
    setIsSaving(true);
    try {
      const nueva = await empresaService.crearCuentaPago({
        banco: cuenta.banco.trim(),
        tipoCuenta: cuenta.tipoCuenta,
        numeroCuenta: cuenta.numeroCuenta.trim(),
        titular: cuenta.titular.trim(),
        moneda: cuenta.moneda,
        instrucciones: cuenta.instrucciones.trim() || undefined,
        activo: true,
      });
      setCuentasPago(prev => [...prev, nueva]);
      showToast('Cuenta bancaria agregada.');
      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudo agregar la cuenta bancaria.'));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const cambiarEstadoCuentaPago = async (cuenta: CuentaPagoTallerResponse) => {
    try {
      const actualizada = await empresaService.cambiarEstadoCuentaPago(cuenta.id, !cuenta.activo);
      setCuentasPago(prev => prev.map(c => c.id === actualizada.id ? actualizada : c));
      showToast(actualizada.activo ? 'Cuenta activada.' : 'Cuenta desactivada.');
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudo cambiar el estado de la cuenta.'));
    }
  };

  // ---- Usuarios ----
  const crearUsuario = async (datos: {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    rol: string;
  }) => {
    setIsSaving(true);
    try {
      const nuevo = await usuariosService.crear({
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        correo: datos.correo.trim(),
        password: datos.password,
        rol: datos.rol,
        activo: true,
      });
      setUsuarios(prev => [...prev, nuevo]);
      showToast(`Usuario ${nuevo.nombre} ${nuevo.apellido} creado.`);
      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudo crear el usuario.'));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const cambiarEstadoUsuario = async (usuario: UsuarioResponse) => {
    try {
      const actualizado = await usuariosService.cambiarEstado(usuario.id, !usuario.activo);
      setUsuarios(prev => prev.map(u => u.id === actualizado.id ? actualizado : u));
      showToast(actualizado.activo ? 'Usuario activado.' : 'Usuario desactivado.');
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudo cambiar el estado del usuario.'));
    }
  };

  // ---- Estados de reparación ----
  const crearEstado = async (nombre: string, colorHex: string) => {
    if (!nombre.trim()) return false;
    setIsSaving(true);
    try {
      const siguienteOrden = estados.length > 0
        ? Math.max(...estados.map(e => e.orden)) + 1
        : 1;
      const nuevo = await estadosReparacionService.crear({
        nombre: nombre.trim(),
        colorHex,
        orden: siguienteOrden,
        estadoFinal: false,
        notificarCliente: false,
      });
      setEstados(prev => [...prev, nuevo]);
      showToast(`Estado "${nuevo.nombre}" agregado.`);
      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudo crear el estado.'));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const actualizarColorEstado = async (estado: EstadoReparacionResponse, colorHex: string) => {
    try {
      const actualizado = await estadosReparacionService.editar(estado.id, {
        nombre: estado.nombre,
        colorHex,
        orden: estado.orden,
        estadoFinal: estado.estadoFinal,
        notificarCliente: estado.notificarCliente,
      });
      setEstados(prev => prev.map(e => e.id === actualizado.id ? actualizado : e));
      showToast(`Color de "${actualizado.nombre}" actualizado.`);
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudo actualizar el estado.'));
    }
  };

  const alternarNotificacionEstado = async (estado: EstadoReparacionResponse) => {
    try {
      const actualizado = await estadosReparacionService.editar(estado.id, {
        nombre: estado.nombre,
        colorHex: estado.colorHex,
        orden: estado.orden,
        estadoFinal: estado.estadoFinal,
        notificarCliente: !estado.notificarCliente,
      });
      setEstados(prev => prev.map(e => e.id === actualizado.id ? actualizado : e));
      showToast(actualizado.notificarCliente
        ? `Se notificará al cliente en "${actualizado.nombre}".`
        : `Ya no se notificará al cliente en "${actualizado.nombre}".`);
    } catch (error) {
      showError(getApiErrorMessage(error, 'No se pudo actualizar la notificación del estado.'));
    }
  };

  const planActual = empresa
    ? planes.find(p => p.codigo === empresa.codigoPlan) ?? null
    : null;

  const estadosOrdenados = [...estados].sort((a, b) => a.orden - b.orden);

  return {
    activeTab, setActiveTab,
    usuarioActual, empresa, planes, planActual, cuentasCobro, cuentasPago, usuarios, estadosOrdenados,
    isLoading, loadError, isSaving, toastMessage, errorMessage,
    guardarEmpresa,
    agregarCuentaPago, cambiarEstadoCuentaPago,
    crearUsuario, cambiarEstadoUsuario,
    crearEstado, actualizarColorEstado, alternarNotificacionEstado,
  };
};

export type ConfiguracionController = ReturnType<typeof useConfiguracion>;
