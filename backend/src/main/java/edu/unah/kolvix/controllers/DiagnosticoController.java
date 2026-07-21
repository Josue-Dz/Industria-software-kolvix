package edu.unah.kolvix.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.diagnostico.DiagnosticoRequest;

@RestController
@RequestMapping("/api/diagnosticos")
public class DiagnosticoController {

    @GetMapping
    public ResponseEntity<DiagnosticoRequest> realizarDiagnostico(){
        return null;
    }

}
