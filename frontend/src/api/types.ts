export type UserRole = "ADMIN" | "PROPIETARIO" | "TECNICO" | string;

export interface UsuarioResponse {
  id: number;
  empresaId: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: UserRole;
  activo: boolean;
  debeCambiarPassword: boolean;
  ultimoAcceso: string | null;
}

export interface AuthResponse {
  usuario: UsuarioResponse;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface EstadoReparacionResponse {
  id: number;
  idEmpresa: number;
  nombre: string;
  colorHex: string;
  orden: number;
  estadoFinal: boolean;
  notificarCliente: boolean;
}

export interface OrdenTrabajoResponse {
  idOrden: number;
  idEmpresa: number;
  idCliente: number;
  idDispositivo: number;
  idTecnico: number | null;
  idEstado: number;
  nombreCliente: string;
  dispositivoResumen: string;
  nombreTecnico: string | null;
  nombreEstado: string;
  colorHexEstado: string | null;
  numeroOrden: string;
  codigoSeguimiento: string;
  problemaReportado: string;
  fechaIngreso: string;
  fechaEntrega: string | null;
  fechaCierre: string | null;
  observaciones: string | null;
  estadoPAgo: string | null;
}

export interface CambioEstadoOrdenRequest {
  estadoNuevoId: number;
  comentario?: string;
}

export interface OrdenTrabajoRequest {
  idCliente: number;
  idDispositivo: number;
  idTecnico?: number | null;
  problemaReportado?: string;
  observaciones?: string;
}

export interface ClienteRequest {
  nombre: string;
  apellido: string;
  dni?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

export interface ClienteResponse {
  idCliente: number;
  idEmpresa: number;
  nombre: string;
  apellido: string;
  dni: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  fechaRegistro: string;
}

export interface DispositivoRequest {
  idCliente: number;
  idCategoria: number;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  color?: string;
  descripcionDispositivo?: string;
  accesoriosRecibidos?: string;
}

export interface DispositivoResponse {
  idDispositivo: number;
  idEmpresa: number;
  idCliente: number;
  idCategoria: number | null;
  nombreCategoria: string | null;
  marca: string | null;
  modelo: string | null;
  numeroSerie: string | null;
  color: string | null;
  descripcionDispositivo: string | null;
  accesoriosRecibidos: string | null;
}

export interface CategoriaDispositivoResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface TecnicoResponse {
  idTecnico: number;
  idEmpresa: number;
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  rtn: string | null;
  direccion: string | null;
  telefono: string;
  fechaNacimiento: string | null;
  nombreContactoEmergencia: string | null;
  telefonoContactoEmergencia: string | null;
  urlFotografia: string | null;
  activo: boolean;
}

export interface TecnicoRegistroRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  dni: string;
  rtn?: string;
  direccion?: string;
  telefono: string;
  fechaNacimiento?: string;
  nombreContactoEmergencia?: string;
  telefonoContactoEmergencia?: string;
  urlFotografia?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export type ComplejidadDiagnostico = "BAJA" | "MEDIA" | "ALTA";

export interface DiagnosticoRepuestoRequest {
  repuestoId?: number | null;
  nombreRepuesto?: string;
  cantidad: number;
  precioUnitario: number;
  observacion?: string;
}

export interface DiagnosticoRepuestoResponse {
  id: number;
  diagnosticoId: number;
  repuestoId: number | null;
  nombreRepuesto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  observacion: string | null;
}

export interface DiagnosticoRequest {
  ordenId: number;
  tecnicoId: number;
  problemaEncontrado: string;
  causaRaiz?: string;
  tiempoEstimadoHoras?: number | null;
  complejidad?: ComplejidadDiagnostico | null;
  observacionesAdicionales?: string;
  repuestos?: DiagnosticoRepuestoRequest[];
}

export interface DiagnosticoResponse {
  id: number;
  empresaId: number;
  ordenId: number;
  tecnicoId: number;
  tecnicoNombre: string | null;
  problemaEncontrado: string;
  causaRaiz: string | null;
  tiempoEstimadoHoras: number | null;
  complejidad: ComplejidadDiagnostico | null;
  fechaDiagnostico: string;
  observacionesAdicionales: string | null;
  repuestos: DiagnosticoRepuestoResponse[];
}

export type EstadoCotizacion =
  | "PENDIENTE"
  | "ENVIADA"
  | "APROBADA"
  | "RECHAZADA"
  | "VENCIDA"
  | "CANCELADA";

export interface CotizacionRequest {
  ordenId: number;
  diagnosticoId: number;
  usuarioCreadorId: number;
  version: number;
  montoManoObra: number;
  montoRepuestos: number;
  montoTotal: number;
  tiempoEstimadoHoras?: number | null;
  observacionInterna?: string;
}

export interface CotizacionResponse {
  id: number;
  empresaId: number;
  ordenId: number;
  diagnosticoId: number;
  usuarioCreadorId: number;
  usuarioCreadorNombre: string | null;
  version: number;
  montoManoObra: number;
  montoRepuestos: number;
  montoTotal: number;
  tiempoEstimadoHoras: number | null;
  estado: EstadoCotizacion;
  fechaCreacion: string;
  fechaEnvio: string | null;
  fechaRespuesta: string | null;
  observacionCliente: string | null;
  observacionInterna: string | null;
}

export interface CotizacionDecisionRequest {
  estado: EstadoCotizacion;
  observacionCliente?: string;
}

export type AlbumEvidenciaCodigo =
  | "RECEPCION"
  | "DIAGNOSTICO"
  | "REPARACION"
  | "CONTROL_CALIDAD"
  | "ENTREGA";

export interface AlbumEvidenciaResponse {
  id: number;
  codigo: AlbumEvidenciaCodigo;
  titulo: string;
  descripcion: string | null;
  obligatorio: boolean;
  orden: number;
  activo: boolean;
}

export interface EvidenciaFotograficaRequest {
  ordenId: number;
  albumId: number;
  usuarioSubidaId?: number | null;
  etiqueta?: string;
  urlImagen: string;
  descripcion?: string;
  obligatorio?: boolean;
  orden?: number;
}

export interface EvidenciaFotograficaResponse {
  id: number;
  ordenId: number;
  albumId: number;
  albumCodigo: AlbumEvidenciaCodigo;
  albumTitulo: string;
  usuarioSubidaId: number | null;
  usuarioSubidaNombre: string | null;
  etiqueta: string | null;
  urlImagen: string;
  descripcion: string | null;
  obligatorio: boolean;
  orden: number;
  fechaSubida: string;
}

export interface RepuestoRequest {
  nombre: string;
  codigo?: string;
  marca?: string;
  stockActual: number;
  stockMinimo: number;
  precioCosto: number;
  precioVenta: number;
  activo: boolean;
}

export interface RepuestoResponse {
  id: number;
  empresaId: number;
  nombre: string;
  codigo: string | null;
  marca: string | null;
  stockActual: number;
  stockMinimo: number;
  precioCosto: number;
  precioVenta: number;
  activo: boolean;
  stockBajo: boolean;
}

export type TipoMovimientoInventario = "ENTRADA" | "SALIDA" | "AJUSTE" | "DEVOLUCION";

export interface MovimientoInventarioRequest {
  repuestoId: number;
  ordenId?: number | null;
  tipoMovimiento: TipoMovimientoInventario;
  cantidad: number;
  precioUnitario: number;
  observacion?: string;
}

export interface MovimientoInventarioResponse {
  id: number;
  repuestoId: number;
  repuestoNombre: string;
  ordenId: number | null;
  usuarioId: number | null;
  usuarioNombre: string | null;
  tipoMovimiento: TipoMovimientoInventario;
  cantidad: number;
  precioUnitario: number;
  observacion: string | null;
  fechaMovimiento: string | null;
}

export type CanalNotificacion = "WHATSAPP" | "EMAIL";

export type EstadoNotificacion = "PENDIENTE" | "ENVIADO" | "FALLIDO" | "CANCELADO";

export interface NotificacionResponse {
  id: number;
  empresaId: number;
  ordenId: number | null;
  clienteId: number | null;
  canal: CanalNotificacion;
  destinatario: string;
  asunto: string | null;
  cuerpo: string;
  estado: EstadoNotificacion;
  fechaProgramada: string | null;
  fechaEnvio: string | null;
  intentos: number;
  errorEnvio: string | null;
}

export interface ArchivoResponse {
  url: string;
  nombreOriginal: string;
}
