package edu.unah.kolvix.dtos.catalogo;

import edu.unah.kolvix.enums.TipoCuenta;

public record CuentaCobroResponse(
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
