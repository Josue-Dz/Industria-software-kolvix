package edu.unah.kolvix.dtos.cliente;

public record DispositivoResponse(
    Long idDispositivo,
    Long idEmpresa,
    Long idCliente,
    Long idCategoria,
    String nombreCategoria,
    String marca,
    String modelo,
    String numeroSerie,
    String color,
    String descripcionDispositivo,
    String accesoriosRecibidos
) {

}
