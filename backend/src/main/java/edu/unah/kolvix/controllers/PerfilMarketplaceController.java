package edu.unah.kolvix.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.marketplace.CambiarVisibilidadRequest;
import edu.unah.kolvix.dtos.marketplace.PerfilMarketplaceRequest;
import edu.unah.kolvix.dtos.marketplace.PerfilMarketplaceResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.PerfilMarketplaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mi-taller/perfil-marketplace")
@RequiredArgsConstructor

public class PerfilMarketplaceController {
    
     private final PerfilMarketplaceService perfilMarketplaceService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<PerfilMarketplaceResponse> obtener() {
        return ResponseEntity.ok(perfilMarketplaceService.obtenerPropio(empresaIdActual()));
    }

    @PutMapping
    public ResponseEntity<PerfilMarketplaceResponse> guardar(@Valid @RequestBody PerfilMarketplaceRequest request) {
        Empresa empresa = authService.getUsuarioAutenticado().getEmpresa();
        return ResponseEntity.ok(perfilMarketplaceService.guardar(request, empresa));
    }

    @PatchMapping("/visibilidad")
    public ResponseEntity<PerfilMarketplaceResponse> cambiarVisibilidad(@Valid @RequestBody CambiarVisibilidadRequest request) {
        return ResponseEntity.ok(perfilMarketplaceService.cambiarVisibilidad(empresaIdActual(), request.visible()));
    }

    private Long empresaIdActual() {
        return authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
    }
}
