package edu.unah.kolvix.dtos.cliente;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequest(
    @NotBlank @Size(max = 50) String nombre,
    @NotBlank @Size(max = 50) String apellido,
    @Size(max = 20) String dni,
    @Size(max = 20) String telefono,
    @Email @Size(max = 100) String correo,
    @Size(max = 255) String direccion
) {

}
