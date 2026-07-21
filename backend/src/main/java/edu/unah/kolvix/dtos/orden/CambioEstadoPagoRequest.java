package edu.unah.kolvix.dtos.orden;

import edu.unah.kolvix.enums.EstadoPagoOrden;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoPagoRequest(
        @NotNull EstadoPagoOrden estadoPago
) {
}
