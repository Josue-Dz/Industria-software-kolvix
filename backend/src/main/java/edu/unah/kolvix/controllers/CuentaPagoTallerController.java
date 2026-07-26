package edu.unah.kolvix.controllers;

import java.util.List;

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

import edu.unah.kolvix.dtos.empresa.CambiarEstadoCuentaRequest;
import edu.unah.kolvix.dtos.empresa.CuentaPagoTallerRequest;
import edu.unah.kolvix.dtos.empresa.CuentaPagoTallerResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.CuentaPagoTallerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cuentas-pago-taller")
@RequiredArgsConstructor
public class CuentaPagoTallerController {
    
    private final CuentaPagoTallerService cuentaPagoTallerService;
    private final AuthService authService;

    @PostMapping("/crear")
    public ResponseEntity<CuentaPagoTallerResponse> crear(@Valid @RequestBody CuentaPagoTallerRequest request) {
        Empresa empresa = authService.getUsuarioAutenticado().getEmpresa();
        return ResponseEntity.status(HttpStatus.CREATED).body(cuentaPagoTallerService.crear(request, empresa));
    }

    @GetMapping
    public ResponseEntity<List<CuentaPagoTallerResponse>> listar() {
        return ResponseEntity.ok(cuentaPagoTallerService.listarTodas(empresaIdActual()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CuentaPagoTallerResponse> editar(@PathVariable Long id,
         @Valid @RequestBody CuentaPagoTallerRequest request) {
        return ResponseEntity.ok(cuentaPagoTallerService.editar(id, empresaIdActual(), request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CuentaPagoTallerResponse> cambiarEstado(@PathVariable Long id,
         @Valid @RequestBody CambiarEstadoCuentaRequest request) {
        return ResponseEntity.ok(cuentaPagoTallerService.cambiarEstado(id, empresaIdActual(), request.activo()));
    }

    private Long empresaIdActual() {
        return authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
    }

}
