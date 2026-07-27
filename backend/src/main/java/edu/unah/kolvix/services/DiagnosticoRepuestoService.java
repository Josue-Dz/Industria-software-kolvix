package edu.unah.kolvix.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.diagnostico.DiagnosticoRepuestoRequest;
import edu.unah.kolvix.dtos.diagnostico.DiagnosticoRepuestoResponse;
import edu.unah.kolvix.entities.Diagnostico;
import edu.unah.kolvix.entities.DiagnosticoRepuesto;
import edu.unah.kolvix.entities.Repuesto;
import edu.unah.kolvix.enums.EstadoCotizacion;
import edu.unah.kolvix.repositories.CotizacionRepository;
import edu.unah.kolvix.repositories.DiagnosticoRepository;
import edu.unah.kolvix.repositories.DiagnosticoRepuestoRepository;
import edu.unah.kolvix.repositories.RepuestoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiagnosticoRepuestoService {

    private final DiagnosticoRepuestoRepository diagnosticoRepuestoRepository;
    private final DiagnosticoRepository diagnosticoRepository;
    private final CotizacionRepository cotizacionRepository;
    private final RepuestoRepository repuestoRepository;

    @Transactional(readOnly = true)
    public List<DiagnosticoRepuestoResponse> listar(Long empresaId, Long idDiagnostico) {
        buscarDiagnostico(idDiagnostico, empresaId);

        return diagnosticoRepuestoRepository
                .findByDiagnosticoIdDiagnosticoAndEmpresaIdEmpresaOrderByIdAsc(idDiagnostico, empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional
    public DiagnosticoRepuestoResponse agregar(Long empresaId, Long idDiagnostico,
            DiagnosticoRepuestoRequest request) {

        Diagnostico diagnostico = buscarDiagnostico(idDiagnostico, empresaId);
        asegurarDiagnosticoSinCotizacion(diagnostico);

        DiagnosticoRepuesto detalle = new DiagnosticoRepuesto();
        detalle.setEmpresa(diagnostico.getEmpresa());
        detalle.setDiagnostico(diagnostico);
        aplicarDatosRepuesto(detalle, empresaId, request);

        return mapearResponse(diagnosticoRepuestoRepository.save(detalle));
    }

    @Transactional
    public DiagnosticoRepuestoResponse editar(Long empresaId, Long idRepuestoDiagnostico, 
        DiagnosticoRepuestoRequest request){

            DiagnosticoRepuesto detalle = buscarDetalle(idRepuestoDiagnostico, empresaId);
            asegurarDiagnosticoSinCotizacion(detalle.getDiagnostico());
            aplicarDatosRepuesto(detalle, empresaId, request);

            return mapearResponse(diagnosticoRepuestoRepository.save(detalle));
    }

    @Transactional
    public void eliminar(Long empresaId, Long idRepuestoDiagnostico){
        DiagnosticoRepuesto detalle = buscarDetalle(idRepuestoDiagnostico, empresaId);
        asegurarDiagnosticoSinCotizacion(detalle.getDiagnostico());
        diagnosticoRepuestoRepository.delete(detalle);
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularMontoRepuestos(Long empresaId, Long idRepuestoDiagnostico) {
        return obtenerRepuestosPorDiagnostico(empresaId, idRepuestoDiagnostico)
               .stream()
               .map(this::calcularSubtotal)
               .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    private Diagnostico buscarDiagnostico(Long idDiagnostico, Long empresaId) {
        return diagnosticoRepository.findByIdDiagnosticoAndEmpresaIdEmpresa(idDiagnostico, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Diagnóstico no encontrado"));
    }


    private DiagnosticoRepuesto buscarDetalle(Long idDiagnostico, Long empresaId) {
        return diagnosticoRepuestoRepository.findByIdAndEmpresaIdEmpresa(idDiagnostico, empresaId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Repuesto Requerido no encontrado"));
    }


    // Los repuestos solo se bloquean cuando la última versión de cotización del diagnóstico
    // está ENVIADA (el cliente evalúa exactamente eso) o APROBADA (compromiso cerrado).
    // Con borrador PENDIENTE o cotización RECHAZADA/VENCIDA/CANCELADA se permiten cambios
    // para preparar la siguiente versión.
    private void asegurarDiagnosticoSinCotizacion(Diagnostico diagnostico) {
        cotizacionRepository
                .findByOrdenIdOrdenAndEmpresaIdEmpresaOrderByVersionDesc(diagnostico.getOrden().getIdOrden(),
                        diagnostico.getEmpresa().getIdEmpresa())
                .stream()
                .filter(c -> Objects.equals(c.getDiagnostico().getIdDiagnostico(), diagnostico.getIdDiagnostico()))
                .findFirst()
                .ifPresent(ultimaVersion -> {
                    if (ultimaVersion.getEstado() == EstadoCotizacion.ENVIADA) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                "La cotización está enviada; espera la respuesta del cliente antes de modificar los repuestos");
                    }
                    if (ultimaVersion.getEstado() == EstadoCotizacion.APROBADA) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                "La cotización ya fue aprobada; los repuestos del diagnóstico quedan bloqueados");
                    }
                });
    }


    private void aplicarDatosRepuesto(DiagnosticoRepuesto detalle, Long empresaId,
            DiagnosticoRepuestoRequest request) {

            validarRequest(request); 

            detalle.setCantidad(request.cantidad());
            detalle.setObservacion(request.observacion());

            if (request.repuestoId() == null){
                detalle.setRepuesto(null);
                detalle.setNombreRepuesto(request.nombreRepuesto().trim());
                detalle.setPrecioUnitario(request.precioUnitario());

                return;
            }

            Repuesto repuestoInventario = repuestoRepository.findByIdRepuestoAndEmpresaIdEmpresa(request.repuestoId(), empresaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Repuesto de inventario no encontrado"));

            if (!repuestoInventario.isActivo()){
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El repuesto de inventario está inactivo");
            }

            detalle.setRepuesto(repuestoInventario);
            detalle.setNombreRepuesto(repuestoInventario.getNombre());
            detalle.setPrecioUnitario(repuestoInventario.getPrecioVenta());

    }


    private void validarRequest(DiagnosticoRepuestoRequest request) {

        if (request.cantidad() == null || request.cantidad() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor que cero");
        }

        if (request.repuestoId() == null) {
            if (request.nombreRepuesto() == null || request.nombreRepuesto().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El repuesto requiere nombre");
            }

            if (request.precioUnitario() == null || request.precioUnitario().signum() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El precio unitario no es válido");
            }
        }
    }


    private BigDecimal calcularSubtotal(DiagnosticoRepuesto detalle) {
        return detalle.getPrecioUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad()));
    }


    private List<DiagnosticoRepuesto> obtenerRepuestosPorDiagnostico(Long empresaId, Long   
                idDiagnostico) {

        buscarDiagnostico(idDiagnostico, empresaId);

        return diagnosticoRepuestoRepository
                .findByDiagnosticoIdDiagnosticoAndEmpresaIdEmpresaOrderByIdAsc(idDiagnostico, empresaId);
    }

    private DiagnosticoRepuestoResponse mapearResponse(DiagnosticoRepuesto detalle) {
        return new DiagnosticoRepuestoResponse(
                detalle.getId(),
                detalle.getDiagnostico().getIdDiagnostico(),
                detalle.getRepuesto() == null ? null : detalle.getRepuesto().getIdRepuesto(),
                detalle.getNombreRepuesto(),
                detalle.getCantidad(),
                detalle.getPrecioUnitario(),
                calcularSubtotal(detalle),
                detalle.getObservacion()
        );
    }

}