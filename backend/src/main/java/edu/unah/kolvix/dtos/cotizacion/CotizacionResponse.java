package edu.unah.kolvix.dtos.cotizacion;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import edu.unah.kolvix.enums.EstadoCotizacion;

public record CotizacionResponse(
        Long id,
        Long empresaId,
        Long ordenId,
        Long diagnosticoId,
        Long usuarioCreadorId,
        String usuarioCreadorNombre,
        short version,
        BigDecimal montoManoObra,
        BigDecimal montoRepuestos,
        BigDecimal montoTotal,
        BigDecimal tiempoEstimadoHoras,
        EstadoCotizacion estado,
        OffsetDateTime fechaCreacion,
        OffsetDateTime fechaEnvio,
        OffsetDateTime fechaRespuesta,
        String observacionCliente,
        String observacionInterna
) {
}
