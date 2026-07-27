package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.catalogo.AlbumEvidenciaResponse;
import edu.unah.kolvix.services.AlbumEvidenciaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/albumes-evidencia")
@RequiredArgsConstructor
public class AlbumEvidenciaController {

    private final AlbumEvidenciaService albumEvidenciaService;

    // Catálogo global de álbumes, disponible para cualquier usuario autenticado
    @GetMapping
    public ResponseEntity<List<AlbumEvidenciaResponse>> listar() {
        return ResponseEntity.ok(albumEvidenciaService.listarActivos());
    }
}
