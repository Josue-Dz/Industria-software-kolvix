package edu.unah.kolvix.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import edu.unah.kolvix.services.AccesoEmpresa;
import edu.unah.kolvix.services.EFotograficaService;
import edu.unah.kolvix.dtos.evidencia.EvidenciaFotograficaRequest;
import edu.unah.kolvix.dtos.evidencia.EvidenciaFotograficaResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("api/evidencias-fotograficas")
@RequiredArgsConstructor
public class EFotograficaController {
    private final EFotograficaService eFotograficaService;
    private final AccesoEmpresa accesoEmpresa;

    //Registar Fotos
    @PostMapping("/subir")
    public EvidenciaFotograficaResponse subirEvidenciaFotografica(@RequestBody EvidenciaFotograficaRequest request) {
        accesoEmpresa.validarOrdenPropia(request.ordenId());
        return eFotograficaService.subirEvidenciaFotografica(request);
    }

    // Asignar Album a Evidencia
    @PatchMapping("{evidenciaId}/asignar-album/{albumId}")
    public EvidenciaFotograficaResponse asignarAlbumId(@PathVariable long evidenciaId, @PathVariable short albumId) {
        accesoEmpresa.validarEvidenciaPropia(evidenciaId);
        return eFotograficaService.AsignarAlbumId(evidenciaId, albumId);
    }
    
    //Buscar evidencias de un orden ID
    @GetMapping("/orden/{ordenId}")
    public List<EvidenciaFotograficaResponse> buscarEvidenciasPorOrdenId(@PathVariable Long ordenId) {
        accesoEmpresa.validarOrdenPropia(ordenId);
        return eFotograficaService.buscarEvidenciasPorOrdenId(ordenId);
    }
}
