package edu.unah.kolvix.dtos.marketplace;

import jakarta.validation.constraints.NotNull;

public record CategoriaServicioRequest(
        @NotNull Integer categoriaId
) {
}
