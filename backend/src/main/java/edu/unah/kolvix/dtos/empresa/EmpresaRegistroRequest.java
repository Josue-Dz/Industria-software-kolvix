package edu.unah.kolvix.dtos.empresa;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmpresaRegistroRequest(
        @NotBlank @Size(max = 100) String nombre,
        @Size(max = 20) String rtn,
        @Size(max = 20) String telefono,
        @NotBlank @Email @Size(max = 100) String correo,
        @Size(max = 255) String direccion,
        @NotBlank @Size(max = 20) String codigoPlan,
        @NotBlank @Size(max = 50) String nombreAdministrador,
        @NotBlank @Size(max = 50) String apellidoAdministrador,
        @NotBlank @Email @Size(max = 100) String correoAdministrador,
        @NotBlank @Size(min = 8, max = 100) String password
) {

}
