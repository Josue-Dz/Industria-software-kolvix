package edu.unah.kolvix.dtos.usuario;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Registro en un solo paso: crea el Usuario (rol TECNICO) y el Tecnico juntos
public record TecnicoRegistroRequest(
        @NotBlank @Size(max = 50) String nombre,
        @NotBlank @Size(max = 50) String apellido,
        @NotBlank @Email @Size(max = 100) String correo,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotBlank @Size(max = 20) String dni,
        @Size(max = 20) String rtn,
        @Size(max = 255) String direccion,
        @NotBlank @Size(max = 20) String telefono,
        LocalDate fechaNacimiento,
        @Size(max = 100) String nombreContactoEmergencia,
        @Size(max = 20) String telefonoContactoEmergencia,
        @Size(max = 255) String urlFotografia
) {}
