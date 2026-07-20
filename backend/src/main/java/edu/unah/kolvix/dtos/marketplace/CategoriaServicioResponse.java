package edu.unah.kolvix.dtos.marketplace;

public record CategoriaServicioResponse(
        Integer id,
        Long empresaId,
        Integer categoriaId,
        String categoriaNombre
) {
}
