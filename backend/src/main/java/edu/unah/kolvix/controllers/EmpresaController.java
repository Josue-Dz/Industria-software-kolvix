package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.catalogo.CuentaCobroResponse;
import edu.unah.kolvix.dtos.catalogo.PlanSuscripcionResponse;
import edu.unah.kolvix.dtos.empresa.EmpresaResponse;
import edu.unah.kolvix.dtos.empresa.EmpresaUpdateRequest;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/empresa")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;
    private final AuthService authService;

    // Datos de la empresa del usuario autenticado (pantalla de configuración).
    @GetMapping("/mi-empresa")
    public ResponseEntity<EmpresaResponse> obtenerMiEmpresa() {
        return ResponseEntity.ok(empresaService.obtener(empresaIdActual()));
    }

    @PutMapping("/mi-empresa")
    public ResponseEntity<EmpresaResponse> actualizarMiEmpresa(@Valid @RequestBody EmpresaUpdateRequest request) {
        return ResponseEntity.ok(empresaService.actualizar(empresaIdActual(), request));
    }

    @GetMapping("/planes")
    public ResponseEntity<List<PlanSuscripcionResponse>> listarPlanes() {
        return ResponseEntity.ok(empresaService.listarPlanes());
    }

    @GetMapping("/cuentas-cobro")
    public ResponseEntity<List<CuentaCobroResponse>> listarCuentasCobro() {
        return ResponseEntity.ok(empresaService.listarCuentasCobro());
    }

    private Long empresaIdActual() {
        return authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
    }
}
