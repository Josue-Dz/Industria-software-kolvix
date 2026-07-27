package edu.unah.kolvix.controllers;
   
import edu.unah.kolvix.dtos.catalogo.CategoriaDispositivoResponse;
import edu.unah.kolvix.repositories.CategoriaDispositivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogos")
@RequiredArgsConstructor
public class CatalogoController {

    private final CategoriaDispositivoRepository categoriaDispositivoRepository;

    @GetMapping("/categorias-dispositivo")
    public ResponseEntity<List<CategoriaDispositivoResponse>> listarCategoriasDispositivo() {
        List<CategoriaDispositivoResponse> categorias = categoriaDispositivoRepository.findAllByOrderByNombreAsc()
                .stream()
                .map(c -> new CategoriaDispositivoResponse(c.getIdCategoria(), c.getNombre(), c.getDescripcion()))
                .toList();
        return ResponseEntity.ok(categorias);
    }
}