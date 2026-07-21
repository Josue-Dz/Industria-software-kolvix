package edu.unah.kolvix.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.usuario.CambiarEstadoRequest;
import edu.unah.kolvix.dtos.usuario.TecnicoRequest;
import edu.unah.kolvix.dtos.usuario.TecnicoResponse;
import edu.unah.kolvix.dtos.usuario.TecnicoUpdateRequest;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.TecnicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tecnicos")
@RequiredArgsConstructor
public class TecnicoController {

    private final TecnicoService tecnicoService;
    private final AuthService authService;


    @PostMapping("/crear")
    public ResponseEntity<TecnicoResponse> crear(@Valid @RequestBody TecnicoRequest request) {
        Empresa empresa = authService.getUsuarioAutenticado().getEmpresa();
        return ResponseEntity.status(HttpStatus.CREATED).body(tecnicoService.crear(request, empresa));
    }

    @GetMapping("/enlistar")
    public ResponseEntity<Page<TecnicoResponse>> listar(@PageableDefault(size = 20) Pageable pageable) {
        Long empresaId = empresaIdActual();
        return ResponseEntity.ok(tecnicoService.listar(empresaId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TecnicoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tecnicoService.obtener(id, empresaIdActual()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TecnicoResponse> editar(@PathVariable Long id,
                                                   @Valid @RequestBody TecnicoUpdateRequest request) {
        return ResponseEntity.ok(tecnicoService.editar(id, empresaIdActual(), request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TecnicoResponse> cambiarEstado(@PathVariable Long id,
                                                          @Valid @RequestBody CambiarEstadoRequest request) {
        return ResponseEntity.ok(tecnicoService.cambiarEstado(id, empresaIdActual(), request.activo()));
    }

    private Long empresaIdActual() {
        Usuario usuario = authService.getUsuarioAutenticado();
        return usuario.getEmpresa().getIdEmpresa();
    }
}
