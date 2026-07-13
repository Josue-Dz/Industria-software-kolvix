package edu.unah.kolvix.dtos.marketplace;

import java.math.BigDecimal;
import java.time.Instant;

public record PerfilMarketplaceResponse(
        Long id,
        Long empresaId,
        String nombreEmpresa,
        String telefonoEmpresa,
        String correoEmpresa,
        String direccionEmpresa,
        String descripcionPublica,
        String horarioAtencion,
        BigDecimal latitud,
        BigDecimal longitud,
        boolean marketplaceVisible,
        BigDecimal calificacionPromedio,
        Integer totalReviews,
        Instant fechaActualizacion
) {
}
