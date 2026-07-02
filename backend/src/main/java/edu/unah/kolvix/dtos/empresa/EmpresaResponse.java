package edu.unah.kolvix.dtos.empresa;

import java.time.Instant;

public record EmpresaResponse(
        Long id,
        String nombre,
        String rtn,
        String telefono,
        String correo,
        String direccion,
        String codigoPlan,
        String nombrePlan,
        boolean activo,
        Instant fechaRegistro
) {

}
