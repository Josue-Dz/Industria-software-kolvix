package edu.unah.kolvix.services;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // El rol admin lo defini aqui y no viene del request
    @Transactional
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


    // Usuario interno para el técnico. Sin login habilitado por ahora:
    // password temporal aleatoria + debeCambiarPassword = true, queda listo para
    // cuando se implemente esa fase.
    public Usuario crearUsuarioTecnico(Empresa empresa, String nombre, String apellido, String correo) {
        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        String passwordTemporal = UUID.randomUUID().toString().replace("-", "").substring(0, 12);

        Usuario usuario = new Usuario();
        usuario.setEmpresa(empresa);
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setCorreo(correo);
        usuario.setPassword(passwordEncoder.encode(passwordTemporal));
        usuario.setRol(RolUsuario.TECNICO);
        usuario.setActivo(true);
        usuario.setDebeCambiarPassword(true);

        return usuarioRepository.save(usuario);
    }
}
