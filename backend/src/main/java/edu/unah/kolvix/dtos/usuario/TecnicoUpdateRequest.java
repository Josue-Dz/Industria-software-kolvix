package edu.unah.kolvix.dtos.usuario;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TecnicoUpdateRequest(
        @Size(max = 20) String dni,
        @Size(max = 20) String rtn,
        @Size(max = 255) String direccion,
        @NotBlank @Size(max = 20) String telefono,
        LocalDate fechaNacimiento,
        @Size(max = 100) String nombreContactoEmergencia,
        @Size(max = 20) String telefonoContactoEmergencia,
        @Size(max = 255) String urlFotografia
) {}