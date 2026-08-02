package edu.unah.kolvix.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import edu.unah.kolvix.services.AccesoEmpresa;
import edu.unah.kolvix.services.RecepcionService;
import jakarta.validation.Valid;
import edu.unah.kolvix.dtos.orden.ChecklistRecepcionRequest;
import edu.unah.kolvix.dtos.orden.ChecklistRecepcionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import edu.unah.kolvix.dtos.orden.ActualizarDanosFisicosRequest;
import edu.unah.kolvix.dtos.orden.ActualizarDetallesRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("api/recepcion")
@RequiredArgsConstructor

public class RecepcionController {
    
    private final RecepcionService recepcionService;
    private final AccesoEmpresa accesoEmpresa;

    @PostMapping("/registrar")
        public ResponseEntity<ChecklistRecepcionResponse> registrarRecepcion(
        @Valid @RequestBody ChecklistRecepcionRequest request
        ) {
        accesoEmpresa.validarOrdenPropia(request.ordenId());
        return ResponseEntity.ok(recepcionService.registrarRecepcion(request));
    }

    @PatchMapping("/{idChecklist}/danos-fisicos")
    public ResponseEntity<ChecklistRecepcionResponse> actualizarDanosFisicos(
            @PathVariable Long idChecklist,
            @Valid @RequestBody ActualizarDanosFisicosRequest request
    ) {
        accesoEmpresa.validarChecklistPropio(idChecklist);
        return ResponseEntity.ok(recepcionService.actualizarDanosFisicos(idChecklist, request));
    }

    @PatchMapping("/{idChecklist}/observaciones")
    public ResponseEntity<ChecklistRecepcionResponse> actualizarObservaciones(
            @PathVariable Long idChecklist,
            @RequestParam String observaciones
    ) {
        accesoEmpresa.validarChecklistPropio(idChecklist);
        return ResponseEntity.ok(recepcionService.actualizarObservaciones(idChecklist, observaciones));
    }

    @PatchMapping("/{idChecklist}/plantilla-inspeccion")
    public ResponseEntity<ChecklistRecepcionResponse> actualizarPlantillaInspeccion(
            @PathVariable Long idChecklist,
            @RequestParam Long plantillaInspeccionId
    ) {
        accesoEmpresa.validarChecklistPropio(idChecklist);
        return ResponseEntity.ok(recepcionService.actualizarPlantillaInspeccion(idChecklist, plantillaInspeccionId));
    }
    
    //Get Checklist por numeroOrden o idOrden, idOrden es FK de checklistRecepcion
    @GetMapping("/orden/{idOrden}")
    public ResponseEntity<ChecklistRecepcionResponse> obtenerChecklistPorOrden(
            @PathVariable Long idOrden,
            @RequestParam Long empresaId
    ) {
        accesoEmpresa.validarEmpresa(empresaId);
        accesoEmpresa.validarOrdenPropia(idOrden);
        return ResponseEntity.ok(recepcionService.obtenerChecklistPorOrden(idOrden, empresaId));
    }

    @GetMapping("/checklist/{idChecklist}")
    public ResponseEntity<ChecklistRecepcionResponse> obtenerChecklist(
            @PathVariable Long idChecklist
    ) {
        accesoEmpresa.validarChecklistPropio(idChecklist);
        return ResponseEntity.ok(recepcionService.obtenerChecklist(idChecklist));
    }

    //Actulizar los demas detalles de ChecklistRecepcion, como estadoFisicoGeneral, aceptacionCliente, urlDocumentoAceptacion, fechaAceptacion
    @PatchMapping("/{idChecklist}/detalles")
    public ResponseEntity<ChecklistRecepcionResponse> actualizarDetallesChecklist(
            @PathVariable Long idChecklist,
            @RequestBody ActualizarDetallesRequest request // Todo viaja seguro en el body
    ) {
        return ResponseEntity.ok(recepcionService.actualizarDetallesChecklist(idChecklist, request));
    }

}
