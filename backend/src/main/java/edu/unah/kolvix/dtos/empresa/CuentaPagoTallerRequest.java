package edu.unah.kolvix.dtos.empresa;

import edu.unah.kolvix.enums.TipoCuenta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CuentaPagoTallerRequest(
        @NotBlank @Size(max = 100) String banco,
        @NotNull TipoCuenta tipoCuenta,
        @NotBlank @Size(max = 50) String numeroCuenta,
        @NotBlank @Size(max = 120) String titular,
        @NotBlank @Size(max = 3) String moneda,
        @Size(max = 255) String instrucciones,
        boolean activo
) {
}
