package edu.unah.kolvix.dtos.orden;

import edu.unah.kolvix.enums.CodigoEstadoReparacion;

public record EstadoReparacionResponse(
    Integer id,
    Long idEmpresa,
    String nombre,
    CodigoEstadoReparacion codigo,
    String colorHex,
    short orden,
    boolean estadoFinal,
    boolean notificarCliente
) {

}
