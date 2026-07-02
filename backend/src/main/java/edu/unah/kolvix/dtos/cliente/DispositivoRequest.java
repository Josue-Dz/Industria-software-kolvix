package edu.unah.kolvix.dtos.cliente;

public record DispositivoRequest(
    Long idCliente,
    Integer idCategoria,
    String marca,
    String modelo,
    String numeroSerie,
    String color,
    String descripcionDispositivo,
    String accesoriosRecibidos
) {

}
