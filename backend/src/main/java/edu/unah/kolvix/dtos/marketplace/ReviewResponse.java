package edu.unah.kolvix.dtos.marketplace;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        Long ordenId,
        Long empresaId,
        String empresaNombre,
        Long clienteId,
        String clienteNombre,
        Short calificacion,
        String comentario,
        Instant fechaReview
) {
}
