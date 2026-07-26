package edu.unah.kolvix.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.diagnostico.DiagnosticoRequest;
import edu.unah.kolvix.dtos.diagnostico.DiagnosticoResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.DiagnosticoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/diagnosticos")
@RequiredArgsConstructor
public class DiagnosticoController {

private final DiagnosticoService diagnosticoService;

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<DiagnosticoResponse> crear(@Valid @RequestBody DiagnosticoRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(diagnosticoService.crear(empresaIdActual(), request));
    }

    @PutMapping("/{idDiagnostico}")
    public ResponseEntity<DiagnosticoResponse> editar(
            @PathVariable Long idDiagnostico,
            @Valid @RequestBody DiagnosticoRequest request
    ) {
        return ResponseEntity.ok(diagnosticoService.editar(
                empresaIdActual(),
                idDiagnostico,
                request
        ));
    }

    @GetMapping("/orden/{ordenId}")
    public ResponseEntity<DiagnosticoResponse> obtenerPorOrden(@PathVariable Long ordenId) {
        return ResponseEntity.ok(diagnosticoService.obtenerPorOrden(empresaIdActual(), ordenId));
    }

    private Long empresaIdActual() {
        Usuario usuario = authService.getUsuarioAutenticado();
        return usuario.getEmpresa().getIdEmpresa();
    }

}
