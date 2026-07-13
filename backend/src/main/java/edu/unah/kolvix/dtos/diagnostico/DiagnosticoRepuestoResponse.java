package edu.unah.kolvix.dtos.diagnostico;

import java.math.BigDecimal;

public record DiagnosticoRepuestoResponse(
        Long id,
        Long diagnosticoId,
        Long repuestoId,
        String nombreRepuesto,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal,
        String observacion
) {
}
