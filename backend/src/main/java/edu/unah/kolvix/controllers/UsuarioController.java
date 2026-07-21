package edu.unah.kolvix.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.usuario.UsuarioRequest;
import edu.unah.kolvix.dtos.usuario.UsuarioResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioRequest request) {
        Empresa empresa = authService.getUsuarioAutenticado().getEmpresa();
        Usuario usuario = usuarioService.crear(request, empresa);
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.mapearUsuarioResponse(usuario));
    }
}
