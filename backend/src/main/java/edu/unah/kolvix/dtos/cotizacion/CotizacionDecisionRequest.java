package edu.unah.kolvix.dtos.cotizacion;

import edu.unah.kolvix.enums.EstadoCotizacion;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CotizacionDecisionRequest(
        @NotNull EstadoCotizacion estado,
        @Size(max = 500) String observacionCliente
) {
}
