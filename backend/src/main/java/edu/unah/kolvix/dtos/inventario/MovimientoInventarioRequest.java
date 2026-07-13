package edu.unah.kolvix.dtos.inventario;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

import edu.unah.kolvix.enums.TipoMovimientoInventario;

public record MovimientoInventarioRequest(
        @NotNull Long repuestoId,
        Long ordenId,
        Long usuarioId,
        @NotNull TipoMovimientoInventario tipoMovimiento,
        @NotNull @Min(1) Integer cantidad,
        @NotNull @DecimalMin("0.00") BigDecimal precioUnitario,
        @Size(max = 255) String observacion
) {
}
