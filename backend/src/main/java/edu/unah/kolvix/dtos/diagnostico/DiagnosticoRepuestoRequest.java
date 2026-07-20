package edu.unah.kolvix.dtos.diagnostico;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record DiagnosticoRepuestoRequest(
        Long repuestoId,
        @NotBlank @Size(max = 100) String nombreRepuesto,
        @NotNull @Min(1) Integer cantidad,
        @NotNull @DecimalMin("0.00") BigDecimal precioUnitario,
        @Size(max = 255) String observacion
) {
}
