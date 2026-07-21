package edu.unah.kolvix.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.usuario.TecnicoRequest;
import edu.unah.kolvix.dtos.usuario.TecnicoResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.TecnicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tecnicos")
@RequiredArgsConstructor
public class TecnicoController {

    private final TecnicoService tecnicoService;
    private final AuthService authService;

    @PutMapping("/{idTecnico}")
    @PreAuthorize("hasRole('ADMIN') or @authService.isTecnicoOwner(#idTecnico)")
    public ResponseEntity<TecnicoResponse> completarDatosTecnico(
            @PathVariable Long idTecnico,
            @Valid @RequestBody TecnicoRequest request) {
        Usuario usuarioAutenticado = authService.getUsuarioAutenticado();
        return ResponseEntity.ok(tecnicoService.completarDatosTecnico(idTecnico, request, usuarioAutenticado));
    }
}
