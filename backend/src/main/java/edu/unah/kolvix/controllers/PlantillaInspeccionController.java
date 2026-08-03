package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.orden.PlantillaInspeccionResponse;
import edu.unah.kolvix.services.PlantillaInspeccionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/plantillas-inspeccion")
@RequiredArgsConstructor
public class PlantillaInspeccionController {

    private final PlantillaInspeccionService plantillaInspeccionService;

    @GetMapping
    public ResponseEntity<List<PlantillaInspeccionResponse>> listar(
            @RequestParam(required = false) Integer categoriaId) {
        return ResponseEntity.ok(plantillaInspeccionService.listar(categoriaId));
    }

    @GetMapping("/{idPlantilla}")
    public ResponseEntity<PlantillaInspeccionResponse> obtener(@PathVariable Long idPlantilla) {
        return ResponseEntity.ok(plantillaInspeccionService.obtener(idPlantilla));
    }
}
