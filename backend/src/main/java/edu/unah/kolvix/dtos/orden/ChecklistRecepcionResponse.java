package edu.unah.kolvix.dtos.orden;

import java.time.Instant;
import java.util.List;

import edu.unah.kolvix.enums.EstadoFisicoGeneral;
import edu.unah.kolvix.model.DanoFisico;

public record ChecklistRecepcionResponse(
        Long id,
        Long ordenId,
        Long usuarioId,
        String usuarioNombre,
        Long plantillaInspeccionId,
        String plantillaNombre,
        EstadoFisicoGeneral estadoFisicoGeneral,
        List<DanoFisico> danosFisicos,
        String observaciones,
        boolean aceptacionCliente,
        String urlDocumentoAceptacion,
        Instant fechaAceptacion,
        Instant fecha
) {
}
