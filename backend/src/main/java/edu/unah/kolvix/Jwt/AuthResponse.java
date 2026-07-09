package edu.unah.kolvix.Jwt;

import edu.unah.kolvix.dtos.usuario.UsuarioResponse;

public record AuthResponse(
    UsuarioResponse usuario
) {
    
}
