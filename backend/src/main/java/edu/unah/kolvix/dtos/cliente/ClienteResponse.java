package edu.unah.kolvix.dtos.cliente;

import java.time.Instant;

public record ClienteResponse(
    Long idCliente,
    Long idEmpresa,
    String nombre,
    String apellido,
    String dni,
    String telefono,
    String correo,
    String direccion,
    Instant fechaRegistro
) {

}
