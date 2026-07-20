package edu.unah.kolvix.dtos.orden;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import edu.unah.kolvix.enums.ResultadoControlCalidad;

public record ControlCalidadResponse(
        Long id,
        Long ordenId,
        Long usuarioId,
        String usuarioNombre,
        List<Map<String, Object>> pruebasRealizadas,
        ResultadoControlCalidad resultadoGeneral,
        String observaciones,
        Instant fechaControl
) {
}
