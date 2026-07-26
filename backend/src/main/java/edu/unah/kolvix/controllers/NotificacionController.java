package edu.unah.kolvix.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.notificacion.NotificacionErrorRequest;
import edu.unah.kolvix.dtos.notificacion.NotificacionRequest;
import edu.unah.kolvix.dtos.notificacion.NotificacionResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.services.AuthService;
import edu.unah.kolvix.services.NotificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<NotificacionResponse> crearPendiente(
            @Valid @RequestBody NotificacionRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(notificacionService.crearPendiente(empresaIdActual(), request));
    }

    @PostMapping("/programar")
    public ResponseEntity<NotificacionResponse> programar(
            @Valid @RequestBody NotificacionRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(notificacionService.programar(empresaIdActual(), request));
    }

    @PostMapping("/{idNotificacion}/enviar")
    public ResponseEntity<NotificacionResponse> enviar(@PathVariable Long idNotificacion) {
        return ResponseEntity.ok(notificacionService.enviar(
                empresaIdActual(),
                idNotificacion
        ));
    }

    @PostMapping("/{idNotificacion}/marcar-enviada")
    public ResponseEntity<NotificacionResponse> marcarEnviada(@PathVariable Long idNotificacion) {
        return ResponseEntity.ok(notificacionService.marcarEnviada(
                empresaIdActual(),
                idNotificacion
        ));
    }

    @PostMapping("/{idNotificacion}/error")
    public ResponseEntity<NotificacionResponse> registrarError(
            @PathVariable Long idNotificacion,
            @Valid @RequestBody NotificacionErrorRequest request
    ) {
        return ResponseEntity.ok(notificacionService.registrarError(
                empresaIdActual(),
                idNotificacion,
                request.errorEnvio()
        ));
    }

    @PostMapping("/{idNotificacion}/cancelar")
    public ResponseEntity<NotificacionResponse> cancelar(@PathVariable Long idNotificacion) {
        return ResponseEntity.ok(notificacionService.cancelar(
                empresaIdActual(),
                idNotificacion
        ));
    }

    @GetMapping("/orden/{ordenId}")
    public ResponseEntity<List<NotificacionResponse>> listarPorOrden(@PathVariable Long ordenId) {
        return ResponseEntity.ok(notificacionService.listarPorOrden(
                empresaIdActual(),
                ordenId
        ));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<NotificacionResponse>> listarPendientes() {
        return ResponseEntity.ok(notificacionService.listarPendientes(empresaIdActual()));
    }

    private Long empresaIdActual() {
        Usuario usuario = authService.getUsuarioAutenticado();
        return usuario.getEmpresa().getIdEmpresa();
    }

}
