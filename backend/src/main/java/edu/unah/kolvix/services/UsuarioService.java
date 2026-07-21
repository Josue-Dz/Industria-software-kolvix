package edu.unah.kolvix.services;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.dtos.usuario.UsuarioRequest;
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


   // Este crear es generico, usado por TecnicoService y (más adelante) por UsuarioController
    // para crear técnicos/recepcionistas. Si no viene password, se genera una
    // temporal y se marca debeCambiarPassword=true (sin login habilitado todavía).
    @Transactional
    public Usuario crear(UsuarioRequest request, Empresa empresa) {
        if (usuarioRepository.existsByCorreoIgnoreCase(request.correo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        boolean sinPassword = request.password() == null || request.password().isBlank();
        String passwordFinal = sinPassword ? generarPasswordTemporal() : request.password();

        Usuario usuario = new Usuario();
        usuario.setEmpresa(empresa);
        usuario.setNombre(request.nombre());
        usuario.setApellido(request.apellido());
        usuario.setCorreo(request.correo());
        usuario.setPassword(passwordEncoder.encode(passwordFinal));
        usuario.setRol(request.rol());
        usuario.setActivo(request.activo());
        usuario.setDebeCambiarPassword(sinPassword);

        return usuarioRepository.save(usuario);
    }

    private String generarPasswordTemporal() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}

