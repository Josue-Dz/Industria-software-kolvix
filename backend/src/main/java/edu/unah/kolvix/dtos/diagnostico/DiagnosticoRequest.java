package edu.unah.kolvix.dtos.diagnostico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

import edu.unah.kolvix.enums.ComplejidadDiagnostico;

public record DiagnosticoRequest(
        @NotNull Long ordenId,
        @NotNull Long tecnicoId,
        @NotBlank String problemaEncontrado,
        String causaRaiz,
        BigDecimal tiempoEstimadoHoras,
        ComplejidadDiagnostico complejidad,
        String observacionesAdicionales,
        List<DiagnosticoRepuestoRequest> repuestos
) {
}
