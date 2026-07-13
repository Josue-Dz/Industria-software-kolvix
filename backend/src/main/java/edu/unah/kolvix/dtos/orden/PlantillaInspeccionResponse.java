package edu.unah.kolvix.dtos.orden;

import java.util.List;
import java.util.Map;

public record PlantillaInspeccionResponse(
        Long id,
        Integer categoriaId,
        String categoriaNombre,
        String nombre,
        String descripcion,
        List<Map<String, Object>> vistas,
        boolean activo
) {
}
