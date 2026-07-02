package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EstadoReparacionRequest(
    @NotBlank @Size(max = 50) String nombre,
    @NotBlank @Size(max = 7) String colorHex,
    short orden,
    boolean estadoFinal,
    boolean notificarCliente
) {
    
}
