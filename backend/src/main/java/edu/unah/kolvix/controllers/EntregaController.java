package edu.unah.kolvix.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import edu.unah.kolvix.dtos.orden.EntregaRequest;
import edu.unah.kolvix.dtos.orden.EntregaResponse;
import edu.unah.kolvix.services.EntregaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ordenes-trabajo/empresa/{empresaId}/entregas")
@RequiredArgsConstructor
public class EntregaController {
    
    private final EntregaService entregaService;

    @PostMapping
    public ResponseEntity<EntregaResponse> registrar(
            @PathVariable Long empresaId,
            @Valid @RequestBody EntregaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(entregaService.registrarEntrega(empresaId, request));
    }

    @GetMapping("/{ordenId}")
    public ResponseEntity<EntregaResponse> obtener(
            @PathVariable Long empresaId,
            @PathVariable Long ordenId) {
        return ResponseEntity.ok(entregaService.obtenerPorOrden(empresaId, ordenId));
    }
}
