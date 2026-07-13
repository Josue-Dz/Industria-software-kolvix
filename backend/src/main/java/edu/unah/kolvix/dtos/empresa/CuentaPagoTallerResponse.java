package edu.unah.kolvix.dtos.empresa;

import edu.unah.kolvix.enums.TipoCuenta;

public record CuentaPagoTallerResponse(
        Long id,
        String banco,
        TipoCuenta tipoCuenta,
        String numeroCuenta,
        String titular,
        String moneda,
        String instrucciones,
        boolean activo
) {
}
