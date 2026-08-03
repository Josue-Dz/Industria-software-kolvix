package edu.unah.kolvix.dtos.orden;

import java.time.Instant;
import edu.unah.kolvix.enums.CodigoEstadoReparacion;
import edu.unah.kolvix.enums.EstadoPagoOrden;

public record OrdenTrabajoResponse(
    Long idOrden,
    Long idEmpresa,
    Long idCliente,
    Long idDispositivo,
    Long idTecnico,
    Integer idEstado,
    String nombreCliente,
    String dispositivoResumen,
    String nombreTecnico,
    String nombreEstado,
    CodigoEstadoReparacion codigoEstado,
    String colorHexEstado,
    String numeroOrden,
    String codigoSeguimiento,
    String problemaReportado,
    Instant fechaIngreso,
    Instant fechaEntrega,
    Instant fechaCierre,
    String observaciones,
    EstadoPagoOrden estadoPAgo
) {

}
