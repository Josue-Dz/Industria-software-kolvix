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

import edu.unah.kolvix.dtos.cliente.DispositivoRequest;
import edu.unah.kolvix.dtos.cliente.DispositivoResponse;
import edu.unah.kolvix.services.AccesoEmpresa;
import edu.unah.kolvix.services.DispositivoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dispositivos")
@RequiredArgsConstructor
public class DispositivoController {

    private final DispositivoService dispositivoService;
    private final AccesoEmpresa accesoEmpresa;

    @PostMapping
    public ResponseEntity<DispositivoResponse> crearDispositivo(@Valid @RequestBody DispositivoRequest request) {
        accesoEmpresa.validarClientePropio(request.idCliente());
        return ResponseEntity.status(HttpStatus.CREATED).body(dispositivoService.crearDispositivo(request));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<DispositivoResponse>> listarDispositivosPorCliente(@PathVariable Long idCliente) {
        accesoEmpresa.validarClientePropio(idCliente);
        return ResponseEntity.ok(dispositivoService.listarDispositivosPorCliente(idCliente));
    }

    @PutMapping("/{idDispositivo}")
    public ResponseEntity<DispositivoResponse> editarDispositivo(
            @PathVariable Long idDispositivo,
            @Valid @RequestBody DispositivoRequest request) {
        accesoEmpresa.validarDispositivoPropio(idDispositivo);
        return ResponseEntity.ok(dispositivoService.editarDispositivo(idDispositivo, request));
    }
}
