package edu.unah.kolvix.services;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.cotizacion.CotizacionDecisionRequest;
import edu.unah.kolvix.dtos.cotizacion.CotizacionRequest;
import edu.unah.kolvix.dtos.cotizacion.CotizacionResponse;
import edu.unah.kolvix.entities.Cotizacion;
import edu.unah.kolvix.entities.Diagnostico;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.EstadoCotizacion;
import edu.unah.kolvix.repositories.CotizacionRepository;
import edu.unah.kolvix.repositories.DiagnosticoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CotizacionService {

private final CotizacionRepository cotizacionRepository;
    private final DiagnosticoRepository diagnosticoRepository;
    private final DiagnosticoRepuestoService diagnosticoRepuestoService;

    @Transactional
    public CotizacionResponse generar( Long empresaId, CotizacionRequest request,
        Usuario usuarioActual) {

        validarUsuarioEmpresa(empresaId, usuarioActual);

        Diagnostico diagnostico = diagnosticoRepository
                .findByIdDiagnosticoAndEmpresaIdEmpresa(request.diagnosticoId(), empresaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Diagnostico no encontrado"
                ));

        if (!Objects.equals(diagnostico.getOrden().getIdOrden(), request.ordenId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El diagnostico no pertenece a la orden indicada"
            );
        }

        if (!Objects.equals(usuarioActual.getIdUsuario(), request.usuarioCreadorId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario creador no coincide con el usuario autenticado"
            );
        }

        BigDecimal montoManoObra = request.montoManoObra();
        BigDecimal montoRepuestos = diagnosticoRepuestoService
                .calcularMontoRepuestos(empresaId, diagnostico.getIdDiagnostico());
        BigDecimal montoTotal = montoManoObra.add(montoRepuestos);

        List<Cotizacion> cotizacionesPrevias = cotizacionRepository
                .findByOrdenIdOrdenAndEmpresaIdEmpresaOrderByVersionDesc(request.ordenId(), empresaId);

        validarQuePuedeCrearNuevaVersion(cotizacionesPrevias);

        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setEmpresa(usuarioActual.getEmpresa());
        cotizacion.setOrden(diagnostico.getOrden());
        cotizacion.setDiagnostico(diagnostico);
        cotizacion.setUsuarioCreador(usuarioActual);
        cotizacion.setVersion(siguienteVersion(cotizacionesPrevias));
        cotizacion.setMontoManoObra(montoManoObra);
        cotizacion.setMontoRepuestos(montoRepuestos);
        cotizacion.setMontoTotal(montoTotal);
        cotizacion.setTiempoEstimadoHoras(diagnostico.getTiempoEstimado());
        cotizacion.setEstado(EstadoCotizacion.PENDIENTE);
        cotizacion.setObservacionInterna(request.observacionInterna());

        return mapearResponse(cotizacionRepository.save(cotizacion));
    }

    @Transactional
    public CotizacionResponse editarBorrador(Long empresaId, Long idCotizacion,
        CotizacionRequest request, Usuario usuarioActual) {
            
        validarUsuarioEmpresa(empresaId, usuarioActual);

        Cotizacion cotizacion = buscarCotizacion(idCotizacion, empresaId);

        if (cotizacion.getEstado() != EstadoCotizacion.PENDIENTE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se puede editar una cotizacion pendiente"
            );
        }

        if (!Objects.equals(cotizacion.getOrden().getIdOrden(), request.ordenId())
                || !Objects.equals(cotizacion.getDiagnostico().getIdDiagnostico(), request.diagnosticoId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede cambiar la orden ni el diagnostico de una cotizacion"
            );
        }

        BigDecimal montoRepuestos = diagnosticoRepuestoService.calcularMontoRepuestos(
                empresaId,
                cotizacion.getDiagnostico().getIdDiagnostico()
        );

        cotizacion.setMontoManoObra(request.montoManoObra());
        cotizacion.setMontoRepuestos(montoRepuestos);
        cotizacion.setMontoTotal(request.montoManoObra().add(montoRepuestos));
        cotizacion.setTiempoEstimadoHoras(cotizacion.getDiagnostico().getTiempoEstimado());
        cotizacion.setObservacionInterna(request.observacionInterna());

        return mapearResponse(cotizacionRepository.save(cotizacion));
    }

    @Transactional
    public CotizacionResponse enviar(Long empresaId, Long idCotizacion) {
        Cotizacion cotizacion = buscarCotizacion(idCotizacion, empresaId);

        if (cotizacion.getEstado() != EstadoCotizacion.PENDIENTE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se puede enviar una cotizacion pendiente"
            );
        }

        cotizacion.setEstado(EstadoCotizacion.ENVIADA);
        cotizacion.setFechaEnvio(Instant.now());

        // La integracion de correo o WhatsApp se delega a NotificacionService.
        return mapearResponse(cotizacionRepository.save(cotizacion));
    }

    @Transactional
    public CotizacionResponse registrarDecision(
            Long empresaId,
            Long idCotizacion,
            CotizacionDecisionRequest request
    ) {
        if (request.estado() != EstadoCotizacion.APROBADA
                && request.estado() != EstadoCotizacion.RECHAZADA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La decision solo puede ser APROBADA o RECHAZADA"
            );
        }

        Cotizacion cotizacion = buscarCotizacion(idCotizacion, empresaId);

        if (cotizacion.getEstado() != EstadoCotizacion.ENVIADA) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se puede responder una cotizacion enviada"
            );
        }

        cotizacion.setEstado(request.estado());
        cotizacion.setObservacionCliente(request.observacionCliente());
        cotizacion.setFechaRespuesta(Instant.now());

        return mapearResponse(cotizacionRepository.save(cotizacion));
    }

    @Transactional(readOnly = true)
    public CotizacionResponse obtener(Long empresaId, Long idCotizacion) {
        return mapearResponse(buscarCotizacion(idCotizacion, empresaId));
    }

    @Transactional(readOnly = true)
    public List<CotizacionResponse> listarPorOrden(Long empresaId, Long ordenId) {
        return cotizacionRepository
                .findByOrdenIdOrdenAndEmpresaIdEmpresaOrderByVersionDesc(ordenId, empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    private short siguienteVersion(List<Cotizacion> cotizacionesPrevias) {
        int siguiente = cotizacionesPrevias.stream()
                .mapToInt(Cotizacion::getVersion)
                .max()
                .orElse(0) + 1;

        if (siguiente > Short.MAX_VALUE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Se alcanzo el limite de versiones de cotizacion"
            );
        }

        return (short) siguiente;
    }

    private void validarQuePuedeCrearNuevaVersion(List<Cotizacion> cotizacionesPrevias) {
        if (cotizacionesPrevias.isEmpty()) {
            return;
        }

        EstadoCotizacion estadoUltimaVersion = cotizacionesPrevias.get(0).getEstado();

        if (estadoUltimaVersion == EstadoCotizacion.RECHAZADA
                || estadoUltimaVersion == EstadoCotizacion.VENCIDA
                || estadoUltimaVersion == EstadoCotizacion.CANCELADA) {
            return;
        }

        if (estadoUltimaVersion == EstadoCotizacion.PENDIENTE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La ultima cotizacion es un borrador; edita ese borrador antes de crear otra version"
            );
        }

        if (estadoUltimaVersion == EstadoCotizacion.ENVIADA) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La ultima cotizacion esta enviada y espera respuesta del cliente"
            );
        }

        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "La orden ya tiene una cotizacion aprobada"
        );
    }

    private Cotizacion buscarCotizacion(Long idCotizacion, Long empresaId) {
        return cotizacionRepository
                .findByIdCotizacionAndEmpresaIdEmpresa(idCotizacion, empresaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cotizacion no encontrada"
                ));
    }

    private void validarUsuarioEmpresa(Long empresaId, Usuario usuarioActual) {
        if (!Objects.equals(usuarioActual.getEmpresa().getIdEmpresa(), empresaId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario no pertenece a la empresa indicada"
            );
        }
    }

    private CotizacionResponse mapearResponse(Cotizacion cotizacion) {
        Usuario creador = cotizacion.getUsuarioCreador();

        return new CotizacionResponse(
                cotizacion.getIdCotizacion(),
                cotizacion.getEmpresa().getIdEmpresa(),
                cotizacion.getOrden().getIdOrden(),
                cotizacion.getDiagnostico().getIdDiagnostico(),
                creador.getIdUsuario(),
                creador.getNombre() + " " + creador.getApellido(),
                cotizacion.getVersion(),
                cotizacion.getMontoManoObra(),
                cotizacion.getMontoRepuestos(),
                cotizacion.getMontoTotal(),
                cotizacion.getTiempoEstimadoHoras(),
                cotizacion.getEstado(),
                aOffsetDateTime(cotizacion.getFechaCreacion()),
                aOffsetDateTime(cotizacion.getFechaEnvio()),
                aOffsetDateTime(cotizacion.getFechaRespuesta()),
                cotizacion.getObservacionCliente(),
                cotizacion.getObservacionInterna()
        );
    }

    private OffsetDateTime aOffsetDateTime(Instant fecha) {
        return fecha == null ? null : fecha.atOffset(ZoneOffset.UTC);
    }

}
