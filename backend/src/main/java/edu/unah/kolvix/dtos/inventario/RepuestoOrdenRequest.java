package edu.unah.kolvix.dtos.inventario;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record RepuestoOrdenRequest(
        @NotNull Long ordenId,
        @NotNull Long repuestoId,
        @NotNull @Min(1) Integer cantidad,
        @NotNull @DecimalMin("0.00") BigDecimal precioUnitario
) {
}
