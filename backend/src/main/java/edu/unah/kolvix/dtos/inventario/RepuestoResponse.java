package edu.unah.kolvix.dtos.inventario;

import java.math.BigDecimal;

public record RepuestoResponse(
        Long id,
        Long empresaId,
        String nombre,
        String codigo,
        String marca,
        Integer stockActual,
        Integer stockMinimo,
        BigDecimal precioCosto,
        BigDecimal precioVenta,
        boolean activo,
        boolean stockBajo
) {
}
