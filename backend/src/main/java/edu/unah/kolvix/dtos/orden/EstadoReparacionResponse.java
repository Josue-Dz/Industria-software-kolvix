package edu.unah.kolvix.dtos.orden;

public record EstadoReparacionResponse(
    Integer id,
    Long idEmpresa,
    String nombre,
    String colorHex,
    short orden,
    boolean estadoFinal,
    boolean notificarCliente
) {

}
