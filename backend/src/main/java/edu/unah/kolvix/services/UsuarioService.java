package edu.unah.kolvix.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.dtos.usuario.UsuarioRequest;
import edu.unah.kolvix.dtos.usuario.UsuarioResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.Tecnico;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.TecnicoRepository;
import edu.unah.kolvix.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final TecnicoRepository tecnicoRepository;
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

    @Transactional
    public UsuarioResponse crearUsuarioPorAdmin(UsuarioRequest request, Usuario admin) {
        if (admin == null || admin.getRol() != RolUsuario.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo un administrador puede crear usuarios");
        }

        if (request.rol() == RolUsuario.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede crear un usuario con rol ADMIN");
        }

        if (usuarioRepository.existsByCorreoIgnoreCase(request.correo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }

        if (request.password() == null || request.password().isBlank() || request.password().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 8 caracteres");
        }

        Usuario usuario = new Usuario();
        usuario.setEmpresa(admin.getEmpresa());
        usuario.setNombre(request.nombre());
        usuario.setApellido(request.apellido());
        usuario.setCorreo(request.correo());
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRol(request.rol());
        usuario.setActivo(request.activo());
        usuario.setDebeCambiarPassword(true);

        Usuario guardado = usuarioRepository.save(usuario);

        if (guardado.getRol() == RolUsuario.TECNICO) {
            if (tecnicoRepository.findAll().stream().noneMatch(tecnico -> tecnico.getUsuario() != null && tecnico.getUsuario().getIdUsuario().equals(guardado.getIdUsuario()))) {
                Tecnico tecnico = new Tecnico();
                tecnico.setEmpresa(guardado.getEmpresa());
                tecnico.setUsuario(guardado);
                tecnico.setActivo(true);
                tecnicoRepository.save(tecnico);
            }
        }

        return mapearUsuarioResponse(guardado);
    }

    private UsuarioResponse mapearUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getEmpresa() != null ? usuario.getEmpresa().getIdEmpresa() : null,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCorreo(),
                usuario.getRol(),
                usuario.isActivo(),
                usuario.isDebeCambiarPassword(),
                usuario.getUltimoAcceso()
        );
    }
}
