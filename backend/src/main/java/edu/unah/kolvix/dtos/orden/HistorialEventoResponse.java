package edu.unah.kolvix.dtos.orden;

import java.time.Instant;

public record HistorialEventoResponse(
    Long id,
        String estadoAnteriorNombre,
        String estadoNuevoNombre,
        String estadoNuevoColorHex,
        String comentario,
        Instant fecha
) {
    
}
