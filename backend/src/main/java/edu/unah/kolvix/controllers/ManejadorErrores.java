package edu.unah.kolvix.controllers;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

// Traduce las excepciones del backend a un JSON con "message", que es el campo
// que lee el frontend (getApiErrorMessage). Sin esto, Spring omite el motivo del
// error y la interfaz solo puede mostrar un texto genérico.
@RestControllerAdvice
public class ManejadorErrores {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> manejarResponseStatus(ResponseStatusException ex) {
        String mensaje = ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString();
        return ResponseEntity.status(ex.getStatusCode()).body(cuerpo(ex.getStatusCode().value(), mensaje));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> manejarIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(cuerpo(HttpStatus.BAD_REQUEST.value(), ex.getMessage()));
    }

    // Errores de validación de los DTO (@Valid): se devuelve el primer campo inválido.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException ex) {
        String mensaje = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> "%s: %s".formatted(error.getField(), error.getDefaultMessage()))
                .orElse("Datos inválidos");
        return ResponseEntity.badRequest().body(cuerpo(HttpStatus.BAD_REQUEST.value(), mensaje));
    }

    private Map<String, Object> cuerpo(int status, String mensaje) {
        Map<String, Object> cuerpo = new HashMap<>();
        cuerpo.put("timestamp", Instant.now().toString());
        cuerpo.put("status", status);
        cuerpo.put("message", mensaje);
        return cuerpo;
    }
}
