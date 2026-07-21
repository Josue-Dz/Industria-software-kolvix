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

import edu.unah.kolvix.dtos.cliente.ClienteRequest;
import edu.unah.kolvix.dtos.cliente.ClienteResponse;
import edu.unah.kolvix.services.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    // Crear un nuevo cliente para una empresa específica a través de su ID de empresa
    @PostMapping("/empresa/{empresaId}")
    public ResponseEntity<ClienteResponse> crearCliente(
            @PathVariable Long empresaId,
            @Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.crearCliente(empresaId, request));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<ClienteResponse>> getClientesEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(clienteService.listarClientesPorEmpresa(empresaId));
    }

    // Para futuro, tranferencia de un cliente a otra empresa, se necesita el id del cliente y el id de la empresa destino,pero primero confirmo con los demas si es necesario, ya que no se especifica en el requerimiento

    @PutMapping("/{idCliente}/empresa/{empresaId}")
    public ResponseEntity<ClienteResponse> editarCliente(
            @PathVariable Long idCliente,
            @PathVariable Long empresaId,
            @Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.ok(clienteService.editarCliente(idCliente, empresaId, request));
    }
}
