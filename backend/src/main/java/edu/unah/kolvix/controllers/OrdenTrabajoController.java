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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.orden.AsignarTecnicoRequest;
import edu.unah.kolvix.dtos.orden.CambioEstadoOrdenRequest;
import edu.unah.kolvix.dtos.orden.CambioEstadoPagoRequest;
import edu.unah.kolvix.dtos.orden.OrdenTrabajoRequest;
import edu.unah.kolvix.dtos.orden.OrdenTrabajoResponse;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.EstadoPagoOrden;
import edu.unah.kolvix.services.AccesoOrdenes;
import edu.unah.kolvix.services.OrdenTrabajoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ordenes-trabajo")
@RequiredArgsConstructor
public class OrdenTrabajoController {

    private final OrdenTrabajoService ordenTrabajoService;
    private final AccesoOrdenes accesoOrdenes;

    @PostMapping("/empresa/{empresaId}")
    public ResponseEntity<OrdenTrabajoResponse> crearOrdenTrabajo(
            @PathVariable Long empresaId,
            @Valid @RequestBody OrdenTrabajoRequest request) {
        accesoOrdenes.validarEmpresa(empresaId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ordenTrabajoService.crearOrdenTrabajo(empresaId, request));
    }
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<OrdenTrabajoResponse>> listarPorEmpresa(@PathVariable Long empresaId) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        return ResponseEntity.ok(accesoOrdenes.filtrarPropias(usuario, ordenTrabajoService.listarPorEmpresa(empresaId)));
    }

    //Filtrar ordenes por empresa,estado de pago y estado de reparacion
    @GetMapping("/empresa/{empresaId}/estado-reparacion")
    public ResponseEntity<List<OrdenTrabajoResponse>> listarPorEmpresaYEstadoReparacion(
            @PathVariable Long empresaId,
            @RequestParam String estadoReparacion) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        return ResponseEntity.ok(accesoOrdenes.filtrarPropias(usuario,
                ordenTrabajoService.listarPorEmpresaYEstadoReparacion(empresaId, estadoReparacion)));
    }

    @GetMapping("/empresa/{empresaId}/estado-pago")
    public ResponseEntity<List<OrdenTrabajoResponse>> listarPorEmpresaYEstadoPago(
            @PathVariable Long empresaId,
            @RequestParam EstadoPagoOrden estadoPago) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        return ResponseEntity.ok(accesoOrdenes.filtrarPropias(usuario,
                ordenTrabajoService.listarPorEmpresaYEstadoPago(empresaId, estadoPago)));
    }

    @GetMapping("/empresa/{empresaId}/tecnico/{tecnicoId}")
    public ResponseEntity<List<OrdenTrabajoResponse>> listarPorEmpresaYTecnico(
            @PathVariable Long empresaId,
            @PathVariable Long tecnicoId) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        Long tecnicoConsultable = accesoOrdenes.resolverTecnicoConsultable(usuario, tecnicoId);
        return ResponseEntity.ok(ordenTrabajoService.listarPorEmpresaYTecnico(empresaId, tecnicoConsultable));
    }

    

    @GetMapping("/empresa/{empresaId}/id/{idOrden}")
    public ResponseEntity<OrdenTrabajoResponse> obtenerPorId(
            @PathVariable Long empresaId,
            @PathVariable Long idOrden) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        OrdenTrabajoResponse orden = ordenTrabajoService.obtenerPorId(empresaId, idOrden);
        accesoOrdenes.validarOrdenPropia(usuario, orden);
        return ResponseEntity.ok(orden);
    }

    @GetMapping("/empresa/{empresaId}/numero/{numeroOrden}")
    public ResponseEntity<OrdenTrabajoResponse> obtenerPorNumero(
            @PathVariable Long empresaId,
            @PathVariable String numeroOrden) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        OrdenTrabajoResponse orden = ordenTrabajoService.obtenerPorNumero(empresaId, numeroOrden);
        accesoOrdenes.validarOrdenPropia(usuario, orden);
        return ResponseEntity.ok(orden);
    }

    @PatchMapping("/empresa/{empresaId}/{idOrden}/estado-pago")
    public ResponseEntity<OrdenTrabajoResponse> cambiarEstadoPago(
            @PathVariable Long empresaId,
            @PathVariable Long idOrden,
            @Valid @RequestBody CambioEstadoPagoRequest request) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        accesoOrdenes.validarOrdenPropia(usuario, ordenTrabajoService.obtenerPorId(empresaId, idOrden));
        return ResponseEntity.ok(ordenTrabajoService.cambiarEstadoPago(empresaId, idOrden, request));
    }

    @PatchMapping("/empresa/{empresaId}/{idOrden}/estado")
    public ResponseEntity<OrdenTrabajoResponse> cambiarEstadoReparacion(
            @PathVariable Long empresaId,
            @PathVariable Long idOrden,
            @Valid @RequestBody CambioEstadoOrdenRequest request) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        accesoOrdenes.validarOrdenPropia(usuario, ordenTrabajoService.obtenerPorId(empresaId, idOrden));
        return ResponseEntity.ok(ordenTrabajoService.cambiarEstadoReparacion(empresaId, idOrden, request));
    }

    @GetMapping("/empresa/{empresaId}/{idOrden}/historial/ultimo")
    public ResponseEntity<edu.unah.kolvix.dtos.orden.HistorialOrdenResponse> obtenerUltimoEvento(
            @PathVariable Long empresaId,
            @PathVariable Long idOrden) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        accesoOrdenes.validarOrdenPropia(usuario, ordenTrabajoService.obtenerPorId(empresaId, idOrden));
        return ResponseEntity.ok(ordenTrabajoService.obtenerUltimoEvento(empresaId, idOrden));
    }

    @GetMapping("/empresa/{empresaId}/{idOrden}/historial")
    public ResponseEntity<List<edu.unah.kolvix.dtos.orden.HistorialOrdenResponse>> obtenerHistorialOrden(
            @PathVariable Long empresaId,
            @PathVariable Long idOrden) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        accesoOrdenes.validarOrdenPropia(usuario, ordenTrabajoService.obtenerPorId(empresaId, idOrden));
        return ResponseEntity.ok(ordenTrabajoService.obtenerHistorialOrden(empresaId, idOrden));
    }

    @GetMapping("/empresa/{empresaId}/numero/{numeroOrden}/historial/ultimo")
    public ResponseEntity<edu.unah.kolvix.dtos.orden.HistorialOrdenResponse> obtenerUltimoEventoPorNumero(
            @PathVariable Long empresaId,
            @PathVariable String numeroOrden) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        accesoOrdenes.validarOrdenPropia(usuario, ordenTrabajoService.obtenerPorNumero(empresaId, numeroOrden));
        return ResponseEntity.ok(ordenTrabajoService.obtenerUltimoEventoPorNumero(empresaId, numeroOrden));
    }

    @GetMapping("/empresa/{empresaId}/numero/{numeroOrden}/historial")
    public ResponseEntity<List<edu.unah.kolvix.dtos.orden.HistorialOrdenResponse>> obtenerHistorialPorNumero(
            @PathVariable Long empresaId,
            @PathVariable String numeroOrden) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        accesoOrdenes.validarOrdenPropia(usuario, ordenTrabajoService.obtenerPorNumero(empresaId, numeroOrden));
        return ResponseEntity.ok(ordenTrabajoService.obtenerHistorialPorNumero(empresaId, numeroOrden));
    }

    @PutMapping("/empresa/{empresaId}/{idOrden}/tecnico")
    public ResponseEntity<OrdenTrabajoResponse> cambiarTecnico(
            @PathVariable Long empresaId,
            @PathVariable Long idOrden,
            @Valid @RequestBody AsignarTecnicoRequest request) {
        Usuario usuario = accesoOrdenes.validarEmpresa(empresaId);
        if (accesoOrdenes.idTecnicoDe(usuario) != null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "Un tecnico no puede reasignar ordenes");
        }
        return ResponseEntity.ok(ordenTrabajoService.cambiarTecnico(empresaId, idOrden, request));
    }
}
