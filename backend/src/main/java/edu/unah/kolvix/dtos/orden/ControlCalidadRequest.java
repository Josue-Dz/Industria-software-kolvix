package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

import edu.unah.kolvix.enums.ResultadoControlCalidad;

public record ControlCalidadRequest(
        @NotNull Long ordenId,
        @NotNull Long usuarioId,
        List<Map<String, Object>> pruebasRealizadas,
        @NotNull ResultadoControlCalidad resultadoGeneral,
        String observaciones
) {
}
