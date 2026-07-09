package edu.unah.kolvix.Jwt;

import edu.unah.kolvix.dtos.empresa.EmpresaResponse;
import edu.unah.kolvix.dtos.usuario.UsuarioResponse;

public record RegistroEmpresaResponse(
    EmpresaResponse empresa,
    UsuarioResponse admin
) {
    
}
