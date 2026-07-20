package edu.unah.kolvix.dtos.inventario;

import java.math.BigDecimal;

public record RepuestoOrdenResponse(
        Long id,
        Long ordenId,
        Long repuestoId,
        String repuestoNombre,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal
) {
}
