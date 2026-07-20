package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import edu.unah.kolvix.enums.EstadoFisicoGeneral;

public record ChecklistRecepcionRequest(
        @NotNull Long ordenId,
        @NotNull Long usuarioId,
        Long plantillaInspeccionId,
        EstadoFisicoGeneral estadoFisicoGeneral,
        List<Map<String, Object>> danosFisicos,
        @Size(max = 500) String observaciones,
        boolean aceptacionCliente,
        @Size(max = 255) String urlDocumentoAceptacion,
        Instant fechaAceptacion
) {
}
