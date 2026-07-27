package edu.unah.kolvix.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.unah.kolvix.dtos.archivo.ArchivoResponse;
import edu.unah.kolvix.services.ArchivoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/archivos")
@RequiredArgsConstructor
public class ArchivoController {

    private final ArchivoService archivoService;

    @PostMapping
    public ResponseEntity<ArchivoResponse> subirImagen(@RequestParam("archivo") MultipartFile archivo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(archivoService.guardarImagen(archivo));
    }
}
