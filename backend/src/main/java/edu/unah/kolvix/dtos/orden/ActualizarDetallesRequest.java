package edu.unah.kolvix.dtos.orden;

import edu.unah.kolvix.enums.EstadoFisicoGeneral;
import java.time.Instant;

public record ActualizarDetallesRequest(
        EstadoFisicoGeneral estadoFisicoGeneral,
        Boolean aceptacionCliente,
        String urlDocumentoAceptacion,
        Instant fechaAceptacion // Spring parsea el formato ISO-8601 automáticamente
) {
}