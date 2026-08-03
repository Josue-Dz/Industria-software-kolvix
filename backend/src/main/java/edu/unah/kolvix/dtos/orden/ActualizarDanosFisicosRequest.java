package edu.unah.kolvix.dtos.orden;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

import edu.unah.kolvix.model.DanoFisico;

public record ActualizarDanosFisicosRequest(
        @NotNull(message = "La lista de daños físicos no puede ser nula")
        @Valid List<DanoFisico> danosFisicos
) {
}
