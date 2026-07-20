package edu.unah.kolvix.dtos.orden;

import java.time.Instant;

public record EntregaResponse(
        Long id,
        Long ordenId,
        Long usuarioEntregaId,
        String usuarioEntregaNombre,
        boolean identidadVerificada,
        String urlComprobanteEntrega,
        String observaciones,
        Instant fechaEntrega
) {
}
