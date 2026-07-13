package edu.unah.kolvix.dtos.orden;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import edu.unah.kolvix.enums.EstadoFisicoGeneral;

public record ChecklistRecepcionResponse(
        Long id,
        Long ordenId,
        Long usuarioId,
        String usuarioNombre,
        Long plantillaInspeccionId,
        EstadoFisicoGeneral estadoFisicoGeneral,
        List<Map<String, Object>> danosFisicos,
        String observaciones,
        boolean aceptacionCliente,
        String urlDocumentoAceptacion,
        Instant fechaAceptacion,
        Instant fecha
) {
}
