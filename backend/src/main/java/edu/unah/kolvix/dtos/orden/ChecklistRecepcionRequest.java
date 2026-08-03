package edu.unah.kolvix.dtos.orden;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

import edu.unah.kolvix.enums.EstadoFisicoGeneral;
import edu.unah.kolvix.model.DanoFisico;

public record ChecklistRecepcionRequest(
        @NotNull Long ordenId,
        Long plantillaInspeccionId,
        EstadoFisicoGeneral estadoFisicoGeneral,
        @Valid List<DanoFisico> danosFisicos,
        @Size(max = 500) String observaciones,
        boolean aceptacionCliente,
        @Size(max = 255) String urlDocumentoAceptacion,
        Instant fechaAceptacion
) {
}
