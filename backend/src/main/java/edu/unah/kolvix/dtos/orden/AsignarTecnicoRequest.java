package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;

public record AsignarTecnicoRequest(
        @NotNull Long idTecnico
) {
}
