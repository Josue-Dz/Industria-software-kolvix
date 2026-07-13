package edu.unah.kolvix.dtos.pago;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

import edu.unah.kolvix.enums.MetodoPagoOrden;

public record PagoOrdenRequest(
        @NotNull Long ordenId,
        Long cuentaId,
        @NotNull @DecimalMin("0.01") BigDecimal monto,
        @NotBlank @Size(max = 3) String moneda,
        @NotNull MetodoPagoOrden metodo,
        @Size(max = 100) String referencia,
        @NotBlank @Size(max = 255) String urlComprobante,
        @Size(max = 255) String observacionCliente
) {
}
