package edu.unah.kolvix.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.Jwt.AuthResponse;
import edu.unah.kolvix.Jwt.JwtService;
import edu.unah.kolvix.Jwt.LoginRequestDTO;
import edu.unah.kolvix.dtos.usuario.UsuarioResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.TecnicoRepository;
import edu.unah.kolvix.repositories.UsuarioRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
private final UsuarioRepository usuarioRepository;
    private final TecnicoRepository tecnicoRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequestDTO dto, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.correo(), dto.password()));

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(dto.correo())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        generarTokenYCookie(usuario, response);

        return new AuthResponse(mapearUsuarioResponse(usuario));
    }

    // En producción (HTTPS) la cookie debe viajar solo por conexión segura. Se
    // deja configurable para no romper las pruebas locales por HTTP:
    // kolvix.security.cookie-secure=true en el despliegue.
    @Value("${kolvix.security.cookie-secure:false}")
    private boolean cookieSegura;

    private static final long DURACION_SESION_SEGUNDOS = 10 * 60 * 60;

    // Reutilizado por EmpresaService al registrar al admin
    public void generarTokenYCookie(Usuario usuario, HttpServletResponse response) {
        String token = jwtService.getToken(usuario);
        response.addHeader(HttpHeaders.SET_COOKIE, construirCookie(token, DURACION_SESION_SEGUNDOS));
    }

    public void logout(HttpServletResponse response) {
        // maxAge 0 borra la cookie en el navegador. Los atributos deben coincidir
        // con los de la cookie original o el navegador no la reemplaza.
        response.addHeader(HttpHeaders.SET_COOKIE, construirCookie("", 0));
    }

    private String construirCookie(String valor, long maxAgeSegundos) {
        return ResponseCookie.from("token", valor)
                // httpOnly evita que un script inyectado pueda leer el token.
                .httpOnly(true)
                .secure(cookieSegura)
                // Lax protege contra CSRF en peticiones desde otros sitios.
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAgeSegundos)
                .build()
                .toString();
    }

    public UsuarioResponse getMyProfile() {
        Usuario usuario = getUsuarioAutenticado();
        return mapearUsuarioResponse(usuario);
    }

    public Usuario getUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario principal = (Usuario) authentication.getPrincipal();

        // Recargar desde BD 
        return usuarioRepository.findByCorreoIgnoreCase(principal.getCorreo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
    }
    public boolean isTecnicoOwner(Long idTecnico) {
        try {
            Usuario usuarioAutenticado = getUsuarioAutenticado();
            if (usuarioAutenticado.getRol() != RolUsuario.TECNICO) {
                return false;
            }

            return tecnicoRepository.findById(idTecnico)
                    .map(tecnico -> tecnico.getUsuario() != null
                            && tecnico.getUsuario().getIdUsuario().equals(usuarioAutenticado.getIdUsuario()))
                    .orElse(false);
        } catch (Exception ex) {
            return false;
        }
    }
    public UsuarioResponse mapearUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getEmpresa().getIdEmpresa(),
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
