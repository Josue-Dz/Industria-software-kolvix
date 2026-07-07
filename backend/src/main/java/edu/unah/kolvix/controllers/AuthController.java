package edu.unah.kolvix.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.dtos.empresa.EmpresaResponse;
import edu.unah.kolvix.services.EmpresaService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmpresaService empresaService;

    @PostMapping("/crear")
    public ResponseEntity<EmpresaResponse> registrarEmpresa(@RequestBody EmpresaRegistroRequest request) {

        EmpresaResponse response = empresaService.registrarEmpresa(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
