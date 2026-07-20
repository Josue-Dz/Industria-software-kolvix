package edu.unah.kolvix.dtos.diagnostico;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import edu.unah.kolvix.enums.ComplejidadDiagnostico;

public record DiagnosticoResponse(
        Long id,
        Long empresaId,
        Long ordenId,
        Long tecnicoId,
        String tecnicoNombre,
        String problemaEncontrado,
        String causaRaiz,
        BigDecimal tiempoEstimadoHoras,
        ComplejidadDiagnostico complejidad,
        Instant fechaDiagnostico,
        String observacionesAdicionales,
        List<DiagnosticoRepuestoResponse> repuestos
) {
}
