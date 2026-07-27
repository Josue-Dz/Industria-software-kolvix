package edu.unah.kolvix.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.orden.SeguimientoOrdenResponse;
import edu.unah.kolvix.services.SeguimientoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seguimiento")
@RequiredArgsConstructor
public class SeguimientoController {
    
        private final SeguimientoService seguimientoService;

    @GetMapping("/{codigo}")
    public ResponseEntity<SeguimientoOrdenResponse> consultar(@PathVariable String codigo) {
        return ResponseEntity.ok(seguimientoService.consultar(codigo));
    }

}
