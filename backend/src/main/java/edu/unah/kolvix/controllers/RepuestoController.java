package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.inventario.RepuestoRequest;
import edu.unah.kolvix.dtos.inventario.RepuestoResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.RepuestoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/repuestos")
@RequiredArgsConstructor
public class RepuestoController {

    private final RepuestoService repuestoService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<RepuestoResponse> crear(@Valid @RequestBody RepuestoRequest request) {
        Empresa empresa = authService.getUsuarioAutenticado().getEmpresa();
        return ResponseEntity.status(HttpStatus.CREATED).body(repuestoService.crear(request, empresa));
    }

    @GetMapping
    public ResponseEntity<List<RepuestoResponse>> listar() {
        return ResponseEntity.ok(repuestoService.listarActivos(empresaIdActual()));
    }

    @PutMapping("/{idRepuesto}")
    public ResponseEntity<RepuestoResponse> editar(
            @PathVariable Long idRepuesto,
            @Valid @RequestBody RepuestoRequest request) {
        return ResponseEntity.ok(repuestoService.editar(idRepuesto, empresaIdActual(), request));
    }

    private Long empresaIdActual() {
        return authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
    }
}
