package edu.unah.kolvix.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.Jwt.AuthResponse;
import edu.unah.kolvix.Jwt.LoginRequestDTO;
import edu.unah.kolvix.Jwt.RegistroEmpresaResponse;
import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.dtos.usuario.UsuarioResponse;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.EmpresaService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmpresaService empresaService;
    private final AuthService authService;
    
    @PostMapping("/crear")
    public ResponseEntity<RegistroEmpresaResponse> registrarEmpresa(
            @RequestBody EmpresaRegistroRequest request,
            HttpServletResponse response) {

        RegistroEmpresaResponse resultado = empresaService.registrarEmpresa(request, response);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequestDTO dto,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(dto, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getMyProfile() {
        return ResponseEntity.ok(authService.getMyProfile());
    }

}
