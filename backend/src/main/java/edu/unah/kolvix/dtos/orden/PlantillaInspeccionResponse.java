package edu.unah.kolvix.dtos.orden;

import java.util.List;

import edu.unah.kolvix.model.VistaChasis;

public record PlantillaInspeccionResponse(
        Long id,
        Integer categoriaId,
        String categoriaNombre,
        String nombre,
        String descripcion,
        List<VistaChasis> vistas,
        boolean activo
) {
}
