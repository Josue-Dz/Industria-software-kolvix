package edu.unah.kolvix.dtos.orden;

import edu.unah.kolvix.dtos.empresa.CuentaPagoTallerResponse;
import edu.unah.kolvix.dtos.marketplace.ReviewResponse;
import java.util.List;

public record SeguimientoOrdenResponse(
    OrdenTrabajoResponse orden,
        List<HistorialEventoResponse> historial,
        List<CuentaPagoTallerResponse> cuentasPago,
        ReviewResponse review,       // null si aún no tiene reseña
        boolean puedeCalificar        // true si está entregada y no tiene reseña
) {
    
}
