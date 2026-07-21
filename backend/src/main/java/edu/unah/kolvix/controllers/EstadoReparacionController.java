package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.orden.CambiarOrdenRequest;
import edu.unah.kolvix.dtos.orden.EstadoReparacionRequest;
import edu.unah.kolvix.dtos.orden.EstadoReparacionResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.EstadoReparacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/estados-reparacion")
@RequiredArgsConstructor
public class EstadoReparacionController {
    
    private final EstadoReparacionService estadoReparacionService;
    private final AuthService authService;

    @PostMapping("/crearEstado")
    public ResponseEntity<EstadoReparacionResponse> crear(@Valid @RequestBody EstadoReparacionRequest request) {
        Empresa empresa = authService.getUsuarioAutenticado().getEmpresa();
        return ResponseEntity.status(HttpStatus.CREATED).body(estadoReparacionService.crear(request, empresa));
    }

    @GetMapping("/enlistar")
    public ResponseEntity<List<EstadoReparacionResponse>> listar() {
        return ResponseEntity.ok(estadoReparacionService.listar(empresaIdActual()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstadoReparacionResponse> editar(@PathVariable Integer id,
                                                            @Valid @RequestBody EstadoReparacionRequest request) {
        return ResponseEntity.ok(estadoReparacionService.editar(id, empresaIdActual(), request));
    }

    @PatchMapping("/{id}/orden")
    public ResponseEntity<EstadoReparacionResponse> cambiarOrden(@PathVariable Integer id,
                                                                  @Valid @RequestBody CambiarOrdenRequest request) {
        return ResponseEntity.ok(estadoReparacionService.cambiarOrden(id, empresaIdActual(), request.orden()));
    }

    private Long empresaIdActual() {
        return authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
    }
}
