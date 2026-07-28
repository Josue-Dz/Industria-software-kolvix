package edu.unah.kolvix.services;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.dtos.usuario.UsuarioRequest;
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

        // Un usuario creado como inactivo no ocupa cupo todavía.
        if (request.activo()) {
            validarCupoDisponible(empresa);
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

    // Usuarios de la empresa, para la pantalla de configuración.
    @Transactional(readOnly = true)
    public List<Usuario> listar(Long empresaId) {
        return usuarioRepository
                .findByEmpresaIdEmpresaOrderByNombreAscApellidoAsc(empresaId, Pageable.unpaged())
                .getContent();
    }

    // Activa o desactiva a un usuario. No se permite desactivar la propia cuenta para
    // no dejar a la empresa sin acceso administrativo por error.
    @Transactional
    public Usuario cambiarEstado(Long idUsuario, Long empresaId, Long idUsuarioSolicitante, boolean activo) {
        if (idUsuario.equals(idUsuarioSolicitante)) {
            throw new IllegalArgumentException("No puedes cambiar el estado de tu propia cuenta");
        }

        Usuario usuario = usuarioRepository.findByIdUsuarioAndEmpresaIdEmpresa(idUsuario, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario no existe en esta empresa"));

        // Reactivar vuelve a ocupar un cupo del plan; desactivar siempre se permite.
        if (activo && !usuario.isActivo()) {
            validarCupoDisponible(usuario.getEmpresa());
        }

        usuario.setActivo(activo);
        return usuarioRepository.save(usuario);
    }

    // Cupo de usuarios activos según el plan contratado por la empresa.
    @Transactional(readOnly = true)
    public LimiteUsuarios consultarLimite(Empresa empresa) {
        Integer maxUsuarios = empresa.getPlanSuscripcion() != null
                ? empresa.getPlanSuscripcion().getMaxUsuarios()
                : null;
        int activos = usuarioRepository.countByEmpresaIdEmpresaAndActivoTrue(empresa.getIdEmpresa());
        return new LimiteUsuarios(activos, maxUsuarios);
    }

    private void validarCupoDisponible(Empresa empresa) {
        LimiteUsuarios limite = consultarLimite(empresa);
        if (limite.ilimitado() || limite.cupoDisponible()) {
            return;
        }

        String nombrePlan = empresa.getPlanSuscripcion() != null
                ? empresa.getPlanSuscripcion().getNombre()
                : "actual";

        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "El plan %s permite %d usuarios activos y ya se alcanzó el límite. "
                        .formatted(nombrePlan, limite.maxUsuarios())
                        + "Desactiva un usuario o cambia de plan para agregar más.");
    }

    // Resultado del cálculo de cupo; maxUsuarios en null significa ilimitado.
    public record LimiteUsuarios(int usuariosActivos, Integer maxUsuarios) {

        public boolean ilimitado() {
            return maxUsuarios == null;
        }

        public boolean cupoDisponible() {
            return ilimitado() || usuariosActivos < maxUsuarios;
        }
    }

    private String generarPasswordTemporal() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}

