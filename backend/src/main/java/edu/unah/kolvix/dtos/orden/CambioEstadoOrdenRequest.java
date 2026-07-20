package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;

public record CambioEstadoOrdenRequest(
        @NotNull Integer estadoNuevoId,
        String comentario
) {
}
