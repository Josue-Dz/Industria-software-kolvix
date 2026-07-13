package edu.unah.kolvix.dtos.inventario;

import java.math.BigDecimal;
import java.time.Instant;

import edu.unah.kolvix.enums.TipoMovimientoInventario;

public record MovimientoInventarioResponse(
        Long id,
        Long repuestoId,
        String repuestoNombre,
        Long ordenId,
        Long usuarioId,
        String usuarioNombre,
        TipoMovimientoInventario tipoMovimiento,
        Integer cantidad,
        BigDecimal precioUnitario,
        String observacion,
        Instant fechaMovimiento
) {
}
