package edu.unah.kolvix.dtos.marketplace;

import java.math.BigDecimal;

public record PerfilMarketplaceRequest(
    String descripcionPublica,
    String horarioAtencion,
    BigDecimal latitud,
    BigDecimal longitud,
    boolean marketplaceVisible
) {

}
