package edu.unah.kolvix.dtos.inventario;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record RepuestoRequest(
        @NotBlank @Size(max = 100) String nombre,
        @Size(max = 80) String codigo,
        @Size(max = 80) String marca,
        @NotNull @Min(0) Integer stockActual,
        @NotNull @Min(0) Integer stockMinimo,
        @NotNull @DecimalMin("0.00") BigDecimal precioCosto,
        @NotNull @DecimalMin("0.00") BigDecimal precioVenta,
        boolean activo
) {
}
