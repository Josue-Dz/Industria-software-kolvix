package edu.unah.kolvix.dtos.usuario;

import java.time.Instant;

import edu.unah.kolvix.enums.RolUsuario;

public record UsuarioResponse(
    Long id,
    Long empresaId,
    String nombre,
    String apellido,
    String correo,
    RolUsuario rol,
    boolean activo,
    boolean debeCambiarPassword,
    Instant ultimoAcceso
) {

}
