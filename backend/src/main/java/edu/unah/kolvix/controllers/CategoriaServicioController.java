package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.marketplace.CategoriaServicioRequest;
import edu.unah.kolvix.dtos.marketplace.CategoriaServicioResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.CategoriaServicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mi-taller/categorias-servicio")
@RequiredArgsConstructor
public class CategoriaServicioController {
    
    private final CategoriaServicioService categoriaServicioService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<CategoriaServicioResponse>> listar() {
        return ResponseEntity.ok(categoriaServicioService.listar(empresaIdActual()));
    }

    @PostMapping
    public ResponseEntity<CategoriaServicioResponse> agregar(@Valid @RequestBody CategoriaServicioRequest request) {
        Empresa empresa = authService.getUsuarioAutenticado().getEmpresa();
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaServicioService.agregar(request, empresa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> quitar(@PathVariable Integer id) {
        categoriaServicioService.quitar(id, empresaIdActual());
        return ResponseEntity.noContent().build();
    }

    private Long empresaIdActual() {
        return authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
    }
}
