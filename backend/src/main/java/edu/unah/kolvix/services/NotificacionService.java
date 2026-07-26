package edu.unah.kolvix.services;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.notificacion.NotificacionRequest;
import edu.unah.kolvix.dtos.notificacion.NotificacionResponse;
import edu.unah.kolvix.entities.Cliente;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.Notificacion;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.enums.CanalNotificacion;
import edu.unah.kolvix.enums.EstadoNotificacion;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.EmpresaRepository;
import edu.unah.kolvix.repositories.NotificacionRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private static final short MAX_INTENTOS = 3;

    private final NotificacionRepository notificacionRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;

    @Transactional
    public NotificacionResponse crearPendiente(Long empresaId, NotificacionRequest request) {
        Notificacion notificacion = construirDesdeRequest(empresaId, request);
        notificacion.setEstado(EstadoNotificacion.PENDIENTE);
        notificacion.setFechaProgramada(fechaProgramadaONow(request.fechaProgramada()));

        return mapearResponse(notificacionRepository.save(notificacion));
    }

    @Transactional
    public NotificacionResponse programar(Long empresaId, NotificacionRequest request) {
        if (request.fechaProgramada() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha programada es obligatoria"
            );
        }

        Notificacion notificacion = construirDesdeRequest(empresaId, request);
        notificacion.setEstado(EstadoNotificacion.PENDIENTE);
        notificacion.setFechaProgramada(request.fechaProgramada());

        return mapearResponse(notificacionRepository.save(notificacion));
    }

    @Transactional
    public NotificacionResponse enviar(Long empresaId, Long idNotificacion) {
        Notificacion notificacion = buscarNotificacion(idNotificacion, empresaId);

        if (notificacion.getEstado() == EstadoNotificacion.ENVIADO) {
            return mapearResponse(notificacion);
        }

        if (notificacion.getEstado() == EstadoNotificacion.CANCELADO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede enviar una notificacion cancelada"
            );
        }

        incrementarIntento(notificacion);

        try {
            enviarSimulado(notificacion);
            marcarComoEnviada(notificacion);
        } catch (RuntimeException ex) {
            marcarComoFallida(notificacion, ex.getMessage());
        }

        return mapearResponse(notificacionRepository.save(notificacion));
    }

    @Transactional
    public NotificacionResponse registrarError(Long empresaId, Long idNotificacion, String errorEnvio) {
        Notificacion notificacion = buscarNotificacion(idNotificacion, empresaId);
        marcarComoFallida(notificacion, errorEnvio);

        return mapearResponse(notificacionRepository.save(notificacion));
    }

    @Transactional
    public NotificacionResponse marcarEnviada(Long empresaId, Long idNotificacion) {
        Notificacion notificacion = buscarNotificacion(idNotificacion, empresaId);
        marcarComoEnviada(notificacion);

        return mapearResponse(notificacionRepository.save(notificacion));
    }

    @Transactional
    public NotificacionResponse cancelar(Long empresaId, Long idNotificacion) {
        Notificacion notificacion = buscarNotificacion(idNotificacion, empresaId);

        if (notificacion.getEstado() == EstadoNotificacion.ENVIADO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede cancelar una notificacion enviada"
            );
        }

        notificacion.setEstado(EstadoNotificacion.CANCELADO);
        return mapearResponse(notificacionRepository.save(notificacion));
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarPorOrden(Long empresaId, Long ordenId) {
        buscarOrden(ordenId, empresaId);

        return notificacionRepository
                .findByEmpresaIdEmpresaAndOrdenIdOrdenOrderByFechaProgramadaDesc(empresaId, ordenId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarPendientes(Long empresaId) {
        return notificacionRepository
                .findByEmpresaIdEmpresaAndEstadoOrderByFechaProgramadaAsc(
                        empresaId,
                        EstadoNotificacion.PENDIENTE
                )
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional
    public List<NotificacionResponse> notificarOrdenRecibida(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Orden recibida",
                "Hemos recibido su equipo. Puede dar seguimiento con el codigo: "
                        + orden.getCodigoSeguimiento(),
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarDiagnosticoCompletado(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Diagnostico completado",
                "Su equipo ya fue diagnosticado. Pronto recibira la cotizacion de reparacion.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarCotizacionEnviada(OrdenTrabajo orden, BigDecimal montoTotal) {
        return crearNotificacionesCliente(
                orden,
                "Cotizacion disponible",
                "Su cotizacion ya esta disponible por un total de L. " + montoTotal
                        + ". Por favor indique si aprueba o rechaza la reparacion.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarCotizacionAprobada(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Cotizacion aprobada",
                "Su aprobacion fue registrada. El equipo pasara al proceso de reparacion.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarCotizacionRechazada(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Cotizacion rechazada",
                "Registramos el rechazo de la cotizacion. Puede coordinar la devolucion del equipo con el taller.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarEquipoEnReparacion(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Equipo en reparacion",
                "Su equipo ya se encuentra en reparacion.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarEquipoListoEntrega(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Equipo listo para entrega",
                "Su equipo esta listo para entrega. Puede pasar al taller cuando guste.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarPagoVerificado(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Pago verificado",
                "El pago de su reparacion fue verificado correctamente.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarPagoRechazado(OrdenTrabajo orden) {
        return crearNotificacionesCliente(
                orden,
                "Pago rechazado",
                "No pudimos verificar el comprobante de pago. Por favor revise la informacion enviada.",
                null
        );
    }

    @Transactional
    public List<NotificacionResponse> notificarSolicitudReview(OrdenTrabajo orden, OffsetDateTime fechaProgramada) {
        return crearNotificacionesCliente(
                orden,
                "Califique su experiencia",
                "Gracias por confiar en el taller. Nos gustaria conocer su experiencia con la reparacion.",
                fechaProgramada
        );
    }

    private Notificacion construirDesdeRequest(Long empresaId, NotificacionRequest request) {
        OrdenTrabajo orden = null;
        Cliente cliente = null;
        Empresa empresa;

        if (request.ordenId() != null) {
            orden = buscarOrden(request.ordenId(), empresaId);
            empresa = orden.getEmpresa();
        } else {
            empresa = buscarEmpresa(empresaId);
        }

        if (request.clienteId() != null) {
            cliente = buscarCliente(request.clienteId(), empresaId);

            if (orden != null && !Objects.equals(orden.getCliente().getIdCliente(), cliente.getIdCliente())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El cliente no pertenece a la orden indicada"
                );
            }
        } else if (orden != null) {
            cliente = orden.getCliente();
        }

        Notificacion notificacion = new Notificacion();
        notificacion.setEmpresa(empresa);
        notificacion.setOrden(orden);
        notificacion.setCliente(cliente);
        notificacion.setCanal(request.canal());
        notificacion.setDestinatario(request.destinatario());
        notificacion.setAsunto(request.asunto());
        notificacion.setCuerpo(request.cuerpo());

        return notificacion;
    }

    private List<NotificacionResponse> crearNotificacionesCliente(
            OrdenTrabajo orden,
            String asunto,
            String cuerpo,
            OffsetDateTime fechaProgramada
    ) {
        List<Notificacion> notificaciones = new ArrayList<>();
        Cliente cliente = orden.getCliente();

        if (cliente.getTelefono() != null && !cliente.getTelefono().isBlank()) {
            notificaciones.add(construirParaCliente(
                    orden,
                    CanalNotificacion.WHATSAPP,
                    cliente.getTelefono(),
                    asunto,
                    cuerpo,
                    fechaProgramada
            ));
        }

        if (cliente.getCorreo() != null && !cliente.getCorreo().isBlank()) {
            notificaciones.add(construirParaCliente(
                    orden,
                    CanalNotificacion.EMAIL,
                    cliente.getCorreo(),
                    asunto,
                    cuerpo,
                    fechaProgramada
            ));
        }

        return notificacionRepository.saveAll(notificaciones)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    private Notificacion construirParaCliente(
            OrdenTrabajo orden,
            CanalNotificacion canal,
            String destinatario,
            String asunto,
            String cuerpo,
            OffsetDateTime fechaProgramada
    ) {
        Notificacion notificacion = new Notificacion();
        notificacion.setEmpresa(orden.getEmpresa());
        notificacion.setOrden(orden);
        notificacion.setCliente(orden.getCliente());
        notificacion.setCanal(canal);
        notificacion.setDestinatario(destinatario);
        notificacion.setAsunto(asunto);
        notificacion.setCuerpo(cuerpo);
        notificacion.setEstado(EstadoNotificacion.PENDIENTE);
        notificacion.setFechaProgramada(fechaProgramadaONow(fechaProgramada));

        return notificacion;
    }

    private void enviarSimulado(Notificacion notificacion) {
        if (notificacion.getDestinatario() == null || notificacion.getDestinatario().isBlank()) {
            throw new IllegalStateException("La notificacion no tiene destinatario");
        }
    }

    private void incrementarIntento(Notificacion notificacion) {
        if (notificacion.getIntentos() >= MAX_INTENTOS) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La notificacion alcanzo el maximo de intentos"
            );
        }

        notificacion.setIntentos((short) (notificacion.getIntentos() + 1));
    }

    private void marcarComoEnviada(Notificacion notificacion) {
        notificacion.setEstado(EstadoNotificacion.ENVIADO);
        notificacion.setFechaEnvio(OffsetDateTime.now());
        notificacion.setErrorEnvio(null);
    }

    private void marcarComoFallida(Notificacion notificacion, String errorEnvio) {
        notificacion.setEstado(EstadoNotificacion.FALLIDO);
        notificacion.setErrorEnvio(errorEnvio);
    }

    private OffsetDateTime fechaProgramadaONow(OffsetDateTime fechaProgramada) {
        return fechaProgramada == null ? OffsetDateTime.now() : fechaProgramada;
    }

    private Notificacion buscarNotificacion(Long idNotificacion, Long empresaId) {
        return notificacionRepository.findById(idNotificacion)
                .filter(notificacion -> Objects.equals(
                        notificacion.getEmpresa().getIdEmpresa(),
                        empresaId
                ))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notificacion no encontrada"
                ));
    }

    private OrdenTrabajo buscarOrden(Long ordenId, Long empresaId) {
        return ordenTrabajoRepository
                .findByIdOrdenAndEmpresaIdEmpresa(ordenId, empresaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Orden de trabajo no encontrada"
                ));
    }

    private Cliente buscarCliente(Long clienteId, Long empresaId) {
        return clienteRepository
                .findByIdClienteAndEmpresaIdEmpresa(clienteId, empresaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente no encontrado"
                ));
    }

    private Empresa buscarEmpresa(Long empresaId) {
        return empresaRepository.findById(empresaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Empresa no encontrada"
                ));
    }

    private NotificacionResponse mapearResponse(Notificacion notificacion) {
        return new NotificacionResponse(
                notificacion.getIdNotificacion(),
                notificacion.getEmpresa().getIdEmpresa(),
                notificacion.getOrden() == null ? null : notificacion.getOrden().getIdOrden(),
                notificacion.getCliente() == null ? null : notificacion.getCliente().getIdCliente(),
                notificacion.getCanal(),
                notificacion.getDestinatario(),
                notificacion.getAsunto(),
                notificacion.getCuerpo(),
                notificacion.getEstado(),
                notificacion.getFechaProgramada(),
                notificacion.getFechaEnvio(),
                notificacion.getIntentos(),
                notificacion.getErrorEnvio()
        );
    }

}
