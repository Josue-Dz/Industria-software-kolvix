package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.cotizacion.CotizacionDecisionRequest;
import edu.unah.kolvix.dtos.cotizacion.CotizacionRequest;
import edu.unah.kolvix.dtos.cotizacion.CotizacionResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.CotizacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cotizaciones")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionService cotizacionService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<CotizacionResponse> generar(@Valid @RequestBody CotizacionRequest request) {
        Usuario usuarioActual = authService.getUsuarioAutenticado();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cotizacionService.generar(
                        usuarioActual.getEmpresa().getIdEmpresa(),
                        request,
                        usuarioActual
                ));
    }

    @PutMapping("/{idCotizacion}/borrador")
    public ResponseEntity<CotizacionResponse> editarBorrador(
            @PathVariable Long idCotizacion,
            @Valid @RequestBody CotizacionRequest request
    ) {
        Usuario usuarioActual = authService.getUsuarioAutenticado();

        return ResponseEntity.ok(cotizacionService.editarBorrador(
                usuarioActual.getEmpresa().getIdEmpresa(),
                idCotizacion,
                request,
                usuarioActual
        ));
    }

    @PostMapping("/{idCotizacion}/enviar")
    public ResponseEntity<CotizacionResponse> enviar(@PathVariable Long idCotizacion) {
        return ResponseEntity.ok(cotizacionService.enviar(empresaIdActual(), idCotizacion));
    }

    @PostMapping("/{idCotizacion}/decision")
    public ResponseEntity<CotizacionResponse> registrarDecision(
            @PathVariable Long idCotizacion,
            @Valid @RequestBody CotizacionDecisionRequest request
    ) {
        return ResponseEntity.ok(cotizacionService.registrarDecision(
                empresaIdActual(),
                idCotizacion,
                request
        ));
    }

    @GetMapping("/{idCotizacion}")
    public ResponseEntity<CotizacionResponse> obtener(@PathVariable Long idCotizacion) {
        return ResponseEntity.ok(cotizacionService.obtener(empresaIdActual(), idCotizacion));
    }

    @GetMapping("/orden/{ordenId}")
    public ResponseEntity<List<CotizacionResponse>> listarPorOrden(@PathVariable Long ordenId) {
        return ResponseEntity.ok(cotizacionService.listarPorOrden(empresaIdActual(), ordenId));
    }

    private Long empresaIdActual() {
        Usuario usuario = authService.getUsuarioAutenticado();
        return usuario.getEmpresa().getIdEmpresa();
    }

}
