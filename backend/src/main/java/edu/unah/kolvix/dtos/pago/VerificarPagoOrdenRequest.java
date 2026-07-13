package edu.unah.kolvix.dtos.pago;

import edu.unah.kolvix.enums.EstadoPagoComprobante;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VerificarPagoOrdenRequest(
        @NotNull EstadoPagoComprobante estado,
        @NotNull Long usuarioVerificaId,
        @Size(max = 255) String observacionTaller
) {
}
