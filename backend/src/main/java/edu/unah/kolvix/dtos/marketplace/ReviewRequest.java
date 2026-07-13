package edu.unah.kolvix.dtos.marketplace;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
        @NotNull Long ordenId,
        @NotNull Long clienteId,
        @NotNull @Min(1) @Max(5) Short calificacion,
        @Size(max = 500) String comentario
) {
}
