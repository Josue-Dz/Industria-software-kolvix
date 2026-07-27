package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.catalogo.CategoriaDispositivoResponse;
import edu.unah.kolvix.services.CategoriaDispositivoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categorias-dispositivos")
@RequiredArgsConstructor
public class CategoriaDispositivoController {

    private final CategoriaDispositivoService categoriaDispositivoService;

    // Catálogo global, disponible para cualquier usuario autenticado
    @GetMapping
    public ResponseEntity<List<CategoriaDispositivoResponse>> listar() {
        return ResponseEntity.ok(categoriaDispositivoService.listar());
    }
}
