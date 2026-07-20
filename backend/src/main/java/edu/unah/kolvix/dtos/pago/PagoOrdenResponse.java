package edu.unah.kolvix.dtos.pago;

import java.math.BigDecimal;
import java.time.Instant;

import edu.unah.kolvix.enums.EstadoPagoComprobante;
import edu.unah.kolvix.enums.MetodoPagoOrden;

public record PagoOrdenResponse(
        Long id,
        Long empresaId,
        Long ordenId,
        Long cuentaId,
        String banco,
        String numeroCuenta,
        BigDecimal monto,
        String moneda,
        MetodoPagoOrden metodo,
        EstadoPagoComprobante estado,
        String referencia,
        String urlComprobante,
        String observacionCliente,
        String observacionTaller,
        Instant fechaSubida,
        Instant fechaVerificacion,
        Long usuarioVerificaId,
        String usuarioVerificaNombre
) {
}
