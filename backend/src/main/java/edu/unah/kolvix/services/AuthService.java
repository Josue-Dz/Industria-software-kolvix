package edu.unah.kolvix.services;

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
import edu.unah.kolvix.repositories.UsuarioRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
private final UsuarioRepository usuarioRepository;
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

    // Reutilizado por EmpresaService al registrar al admin
    public void generarTokenYCookie(Usuario usuario, HttpServletResponse response) {
        String token = jwtService.getToken(usuario);
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(10 * 60 * 60)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0) // borra la cookie
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
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
