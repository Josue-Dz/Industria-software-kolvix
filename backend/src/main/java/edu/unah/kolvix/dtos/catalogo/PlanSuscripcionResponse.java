package edu.unah.kolvix.dtos.catalogo;

import java.math.BigDecimal;

public record PlanSuscripcionResponse(
        String codigo,
        String nombre,
        String descripcion,
        BigDecimal montoMensual,
        String moneda,
        Integer maxUsuarios,
        boolean activo
) {
}
