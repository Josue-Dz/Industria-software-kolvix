package edu.unah.kolvix.dtos.cotizacion;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CotizacionRequest(
        @NotNull Long ordenId,
        @NotNull Long diagnosticoId,
        @NotNull Long usuarioCreadorId,
        short version,
        @NotNull @DecimalMin("0.00") BigDecimal montoManoObra,
        @NotNull @DecimalMin("0.00") BigDecimal montoRepuestos,
        @NotNull @DecimalMin("0.00") BigDecimal montoTotal,
        BigDecimal tiempoEstimadoHoras,
        @Size(max = 500) String observacionInterna
) {
}
