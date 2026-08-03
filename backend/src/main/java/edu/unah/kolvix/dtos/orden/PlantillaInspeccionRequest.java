package edu.unah.kolvix.dtos.orden;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

import edu.unah.kolvix.model.VistaChasis;

public record PlantillaInspeccionRequest(
        @NotNull Integer categoriaId,
        @NotBlank @Size(max = 100) String nombre,
        @Size(max = 255) String descripcion,
        @Valid List<VistaChasis> vistas,
        boolean activo
) {
}
