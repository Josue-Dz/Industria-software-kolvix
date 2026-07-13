package edu.unah.kolvix.dtos.orden;

import java.time.Instant;

public record HistorialOrdenResponse(
        Long id,
        Long ordenId,
        Long usuarioId,
        String usuarioNombre,
        Integer estadoAnteriorId,
        String estadoAnteriorNombre,
        Integer estadoNuevoId,
        String estadoNuevoNombre,
        String comentario,
        Instant fecha
) {
}
