package edu.unah.kolvix.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // El rol admin lo defini aqui y no viene del request
    public Usuario crearUsuarioAdmin(Empresa empresa, EmpresaRegistroRequest request) {
        if (usuarioRepository.existsByCorreoIgnoreCase(request.correoAdministrador())) {
            throw new IllegalArgumentException("El correo del administrador ya está registrado");
        }

        Usuario admin = new Usuario();
        admin.setEmpresa(empresa);
        admin.setNombre(request.nombreAdministrador());
        admin.setApellido(request.apellidoAdministrador());
        admin.setCorreo(request.correoAdministrador());
        admin.setPassword(passwordEncoder.encode(request.password()));
        admin.setRol(RolUsuario.ADMIN);
        admin.setActivo(true);

        return usuarioRepository.save(admin);
    }
}
