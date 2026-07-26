package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public record ActualizarDanosFisicosRequest(
        @NotNull(message = "El ID del usuario es obligatorio para validar permisos") 
        Long usuarioId,
        
        @NotNull(message = "La lista de daños físicos no puede ser nula") 
        List<Map<String, Object>> danosFisicos
) {
}