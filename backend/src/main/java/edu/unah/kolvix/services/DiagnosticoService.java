package edu.unah.kolvix.services;

import java.math.BigDecimal;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.diagnostico.DiagnosticoRequest;
import edu.unah.kolvix.dtos.diagnostico.DiagnosticoResponse;
import edu.unah.kolvix.entities.Diagnostico;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.Tecnico;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.EstadoCotizacion;
import edu.unah.kolvix.repositories.CotizacionRepository;
import edu.unah.kolvix.repositories.DiagnosticoRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiagnosticoService {

    private final DiagnosticoRepository diagnosticoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final CotizacionRepository cotizacionRepository;
    private final DiagnosticoRepuestoService diagnosticoRepuestoService;

    @Transactional
    public DiagnosticoResponse crear(Long empresaId, DiagnosticoRequest request) {
        OrdenTrabajo orden = buscarOrden(request.ordenId(), empresaId);

        diagnosticoRepository
                .findByOrdenIdOrdenAndEmpresaIdEmpresa(request.ordenId(), empresaId)
                .ifPresent(diagnostico -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "La orden ya posee un diagnostico"
                    );
                });

        validarTecnicoAsignado(orden, request.tecnicoId());
        validarTiempoEstimado(request.tiempoEstimadoHoras());

        Diagnostico diagnostico = new Diagnostico();
        diagnostico.setEmpresa(orden.getEmpresa());
        diagnostico.setOrden(orden);
        diagnostico.setTecnico(orden.getTecnico());
        diagnostico.setProblemaEncontrado(request.problemaEncontrado());
        diagnostico.setCausaRaiz(request.causaRaiz());
        diagnostico.setTiempoEstimado(request.tiempoEstimadoHoras());
        diagnostico.setComplejidad(request.complejidad());
        diagnostico.setObservacionesAdicionales(request.observacionesAdicionales());

        diagnostico = diagnosticoRepository.save(diagnostico);
        Long idDiagnostico = diagnostico.getIdDiagnostico();

        if (request.repuestos() != null) {
            request.repuestos().forEach(repuesto -> diagnosticoRepuestoService.agregar(
                    empresaId,
                    idDiagnostico,
                    repuesto
            ));
        }

        return mapearResponse(diagnostico);
    }

    @Transactional
    public DiagnosticoResponse editar(
            Long empresaId,
            Long idDiagnostico,
            DiagnosticoRequest request
    ) {
        if (request.repuestos() != null && !request.repuestos().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los repuestos se editan mediante DiagnosticoRepuestoService"
            );
        }

        Diagnostico diagnostico = buscarDiagnostico(idDiagnostico, empresaId);

        if (!Objects.equals(diagnostico.getOrden().getIdOrden(), request.ordenId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La orden del diagnostico no puede modificarse"
            );
        }

        if (!Objects.equals(diagnostico.getTecnico().getIdTecnico(), request.tecnicoId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tecnico del diagnostico no puede modificarse"
            );
        }

        asegurarDiagnosticoSinCotizacion(diagnostico);
        validarTiempoEstimado(request.tiempoEstimadoHoras());

        diagnostico.setProblemaEncontrado(request.problemaEncontrado());
        diagnostico.setCausaRaiz(request.causaRaiz());
        diagnostico.setTiempoEstimado(request.tiempoEstimadoHoras());
        diagnostico.setComplejidad(request.complejidad());
        diagnostico.setObservacionesAdicionales(request.observacionesAdicionales());

        return mapearResponse(diagnosticoRepository.save(diagnostico));
    }

    @Transactional(readOnly = true)
    public DiagnosticoResponse obtenerPorOrden(Long empresaId, Long ordenId) {
        Diagnostico diagnostico = diagnosticoRepository
                .findByOrdenIdOrdenAndEmpresaIdEmpresa(ordenId, empresaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "La orden no posee un diagnostico"
                ));

        return mapearResponse(diagnostico);
    }

    private Diagnostico buscarDiagnostico(Long idDiagnostico, Long empresaId) {
        return diagnosticoRepository
                .findByIdDiagnosticoAndEmpresaIdEmpresa(idDiagnostico, empresaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Diagnostico no encontrado"
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

    private void validarTecnicoAsignado(OrdenTrabajo orden, Long tecnicoIdRequest) {
        Tecnico tecnicoAsignado = orden.getTecnico();

        if (tecnicoAsignado == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La orden debe tener un tecnico asignado antes de registrar el diagnostico"
            );
        }

        if (!Objects.equals(tecnicoAsignado.getIdTecnico(), tecnicoIdRequest)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tecnico indicado no coincide con el tecnico asignado a la orden"
            );
        }
    }

    private void validarTiempoEstimado(BigDecimal tiempoEstimadoHoras) {
        if (tiempoEstimadoHoras != null && tiempoEstimadoHoras.signum() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tiempo estimado no puede ser negativo"
            );
        }
    }

    // El diagnóstico solo se bloquea cuando su última versión de cotización está ENVIADA
    // o APROBADA; con borrador PENDIENTE o cotización RECHAZADA/VENCIDA/CANCELADA se
    // permiten cambios para preparar la siguiente versión.
    private void asegurarDiagnosticoSinCotizacion(Diagnostico diagnostico) {
        cotizacionRepository
                .findByOrdenIdOrdenAndEmpresaIdEmpresaOrderByVersionDesc(
                        diagnostico.getOrden().getIdOrden(),
                        diagnostico.getEmpresa().getIdEmpresa()
                )
                .stream()
                .filter(c -> Objects.equals(c.getDiagnostico().getIdDiagnostico(), diagnostico.getIdDiagnostico()))
                .findFirst()
                .ifPresent(ultimaVersion -> {
                    if (ultimaVersion.getEstado() == EstadoCotizacion.ENVIADA) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "La cotización está enviada; espera la respuesta del cliente antes de editar el diagnóstico"
                        );
                    }
                    if (ultimaVersion.getEstado() == EstadoCotizacion.APROBADA) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "La cotización ya fue aprobada; el diagnóstico queda bloqueado"
                        );
                    }
                });
    }

    private DiagnosticoResponse mapearResponse(Diagnostico diagnostico) {
        Tecnico tecnico = diagnostico.getTecnico();
        Usuario usuario = tecnico.getUsuario();

        return new DiagnosticoResponse(
                diagnostico.getIdDiagnostico(),
                diagnostico.getEmpresa().getIdEmpresa(),
                diagnostico.getOrden().getIdOrden(),
                tecnico.getIdTecnico(),
                usuario.getNombre() + " " + usuario.getApellido(),
                diagnostico.getProblemaEncontrado(),
                diagnostico.getCausaRaiz(),
                diagnostico.getTiempoEstimado(),
                diagnostico.getComplejidad(),
                diagnostico.getFechaDiagnostico(),
                diagnostico.getObservacionesAdicionales(),
                diagnosticoRepuestoService.listar(
                        diagnostico.getEmpresa().getIdEmpresa(),
                        diagnostico.getIdDiagnostico()
                )
        );
    }

}
