package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.diagnostico.DiagnosticoRepuestoRequest;
import edu.unah.kolvix.dtos.diagnostico.DiagnosticoRepuestoResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.DiagnosticoRepuestoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/diagnosticos")
@RequiredArgsConstructor
public class DiagnosticoRepuestoController {

    private final DiagnosticoRepuestoService diagnosticoRepuestoService;
    private final AuthService authService;

    @GetMapping("/{idDiagnostico}/repuestos")
    public ResponseEntity<List<DiagnosticoRepuestoResponse>> listar(@PathVariable Long idDiagnostico) {
        return ResponseEntity.ok(diagnosticoRepuestoService.listar(
                empresaIdActual(),
                idDiagnostico
        ));
    }

    @PostMapping("/{idDiagnostico}/repuestos")
    public ResponseEntity<DiagnosticoRepuestoResponse> agregar(
            @PathVariable Long idDiagnostico,
            @Valid @RequestBody DiagnosticoRepuestoRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(diagnosticoRepuestoService.agregar(
                        empresaIdActual(),
                        idDiagnostico,
                        request
                ));
    }

    @PutMapping("/repuestos/{idRepuestoDiagnostico}")
    public ResponseEntity<DiagnosticoRepuestoResponse> editar(
        @PathVariable Long idRepuestoDiagnostico,
        @Valid @RequestBody DiagnosticoRepuestoRequest request) {

        return ResponseEntity.ok(diagnosticoRepuestoService.editar(
                empresaIdActual(),
                idRepuestoDiagnostico,
                request
        ));
    }

    @DeleteMapping("/repuestos/{idRepuestoDiagnostico}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idRepuestoDiagnostico) {
        diagnosticoRepuestoService.eliminar(empresaIdActual(), idRepuestoDiagnostico);
        return ResponseEntity.noContent().build();
    }

    private Long empresaIdActual() {
        Usuario usuario = authService.getUsuarioAutenticado();
        return usuario.getEmpresa().getIdEmpresa();
    }

}
