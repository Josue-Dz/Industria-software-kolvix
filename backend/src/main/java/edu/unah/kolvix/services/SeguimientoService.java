package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.empresa.CuentaPagoTallerResponse;
import edu.unah.kolvix.dtos.marketplace.ReviewResponse;
import edu.unah.kolvix.dtos.orden.HistorialEventoResponse;
import edu.unah.kolvix.dtos.orden.OrdenTrabajoResponse;
import edu.unah.kolvix.dtos.orden.SeguimientoOrdenResponse;
import edu.unah.kolvix.entities.HistorialOrden;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.Review;
import edu.unah.kolvix.repositories.HistorialOrdenRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import edu.unah.kolvix.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SeguimientoService {
    
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final HistorialOrdenRepository historialOrdenRepository;
    private final CuentaPagoTallerService cuentaPagoTallerService;
    private final ReviewRepository reviewRepository;

    public SeguimientoOrdenResponse consultar(String codigoSeguimiento) {
    OrdenTrabajo orden = ordenTrabajoRepository.findByCodigoSeguimiento(codigoSeguimiento)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada"));

    Long empresaId = orden.getEmpresa().getIdEmpresa();

    OrdenTrabajoResponse ordenResponse = mapearOrden(orden);

    List<HistorialEventoResponse> historial = historialOrdenRepository
            .findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByFechaAsc(orden.getIdOrden(), empresaId)
            .stream()
            .map(this::mapearHistorial)
            .toList();

    boolean entregada = orden.getFechaEntrega() != null;

    boolean listaParaEntrega = orden.getEstado() != null
            && "Listo para entrega".equalsIgnoreCase(orden.getEstado().getNombre());

    // Las cuentas solo se muestran mientras el cliente aún no ha retirado el
    // equipo (pendiente de pagar). Una vez registrada la entrega real, se
    // asume que el pago ya se resolvió y se le da paso a la reseña.
    boolean mostrarCuentasPago = listaParaEntrega && !entregada;

    List<CuentaPagoTallerResponse> cuentasPago = mostrarCuentasPago
            ? cuentaPagoTallerService.listarActivas(empresaId)
            : List.of();

    Review review = reviewRepository.findByOrdenIdOrdenAndEmpresaIdEmpresa(orden.getIdOrden(), empresaId)
            .orElse(null);

    ReviewResponse reviewResponse = review != null ? mapearReview(review) : null;

    boolean puedeCalificar = entregada && review == null;

    return new SeguimientoOrdenResponse(ordenResponse, historial, cuentasPago, reviewResponse, puedeCalificar, mostrarCuentasPago);
}

    private OrdenTrabajoResponse mapearOrden(OrdenTrabajo orden) {
        return new OrdenTrabajoResponse(
                orden.getIdOrden(),
                orden.getEmpresa().getIdEmpresa(),
                orden.getCliente().getIdCliente(),
                orden.getDispositivo().getIdDispositivo(),
                orden.getTecnico() != null ? orden.getTecnico().getIdTecnico() : null,
                orden.getEstado().getIdEstado(),
                orden.getCliente().getNombre() + " " + orden.getCliente().getApellido(),
                orden.getDispositivo().getMarca() + " " + orden.getDispositivo().getModelo(),
                orden.getTecnico() != null
                        ? orden.getTecnico().getUsuario().getNombre() + " " + orden.getTecnico().getUsuario().getApellido()
                        : null,
                orden.getEstado().getNombre(),
                orden.getEstado().getColorHex(),
                orden.getNumeroOrden(),
                orden.getCodigoSeguimiento(),
                orden.getProblemaReportado(),
                orden.getFechaIngreso(),
                orden.getFechaEntrega(),
                orden.getFechaCierre(),
                orden.getObservaciones(),
                orden.getEstadoPago()
        );
    }

    private HistorialEventoResponse mapearHistorial(HistorialOrden h) {
        return new HistorialEventoResponse(
                h.getIdHistorial(),
                h.getEstadoAnterior() != null ? h.getEstadoAnterior().getNombre() : null,
                h.getEstadoNuevo().getNombre(),
                h.getEstadoNuevo().getColorHex(),
                h.getComentario(),
                h.getFecha()
        );
    }

    private ReviewResponse mapearReview(Review review) {
        return new ReviewResponse(
                review.getIdReview(),
                review.getOrden().getIdOrden(),
                review.getEmpresa().getIdEmpresa(),
                review.getEmpresa().getNombre(),
                review.getCliente().getIdCliente(),
                review.getCliente().getNombre() + " " + review.getCliente().getApellido(),
                review.getCalificacion(),
                review.getComentario(),
                review.getFechaReview() != null ? review.getFechaReview().toInstant() : null
        );
    }

}
