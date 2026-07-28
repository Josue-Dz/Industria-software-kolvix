package edu.unah.kolvix.controllers;
   
import edu.unah.kolvix.dtos.catalogo.CategoriaDispositivoResponse;
import edu.unah.kolvix.dtos.catalogo.PlanSuscripcionResponse;
import edu.unah.kolvix.repositories.CategoriaDispositivoRepository;
import edu.unah.kolvix.services.EmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogos")
@RequiredArgsConstructor
public class CatalogoController {

    private final CategoriaDispositivoRepository categoriaDispositivoRepository;
    private final EmpresaService empresaService;

    @GetMapping("/categorias-dispositivo")
    public ResponseEntity<List<CategoriaDispositivoResponse>> listarCategoriasDispositivo() {
        List<CategoriaDispositivoResponse> categorias = categoriaDispositivoRepository.findAllByOrderByNombreAsc()
                .stream()
                .map(c -> new CategoriaDispositivoResponse(c.getIdCategoria(), c.getNombre(), c.getDescripcion()))
                .toList();
        return ResponseEntity.ok(categorias);
    }

    // Planes visibles en la página pública de precios (sin login). Reutiliza el
    // mismo catálogo que ve la empresa autenticada en Configuración.
    @GetMapping("/planes")
    public ResponseEntity<List<PlanSuscripcionResponse>> listarPlanes() {
        return ResponseEntity.ok(empresaService.listarPlanes());
    }
}