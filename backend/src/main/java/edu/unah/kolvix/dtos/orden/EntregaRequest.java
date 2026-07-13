package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EntregaRequest(
        @NotNull Long ordenId,
        @NotNull Long usuarioEntregaId,
        boolean identidadVerificada,
        @Size(max = 255) String urlComprobanteEntrega,
        String observaciones
) {
}
