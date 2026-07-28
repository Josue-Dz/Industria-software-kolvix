package edu.unah.kolvix.dtos.empresa;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmpresaUpdateRequest(
        @NotBlank @Size(max = 100) String nombre,
        @Size(max = 20) String rtn,
        @Size(max = 20) String telefono,
        @NotBlank @Email @Size(max = 100) String correo,
        @Size(max = 255) String direccion
) {
}
