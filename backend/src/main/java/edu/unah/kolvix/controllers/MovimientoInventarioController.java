package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.inventario.MovimientoInventarioRequest;
import edu.unah.kolvix.dtos.inventario.MovimientoInventarioResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.TipoMovimientoInventario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.MovimientoInventarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movimientos-inventario")
@RequiredArgsConstructor
public class MovimientoInventarioController {

    private final MovimientoInventarioService movimientoService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<MovimientoInventarioResponse> registrar(@Valid @RequestBody MovimientoInventarioRequest request) {
        Usuario usuario = authService.getUsuarioAutenticado();
        return ResponseEntity.status(HttpStatus.CREATED).body(movimientoService.registrar(request, usuario));
    }

    @GetMapping
    public ResponseEntity<List<MovimientoInventarioResponse>> listar(
            @RequestParam(required = false) Long repuestoId,
            @RequestParam(required = false) TipoMovimientoInventario tipo) {
        Long empresaId = authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
        return ResponseEntity.ok(movimientoService.listar(empresaId, repuestoId, tipo));
    }
}
