package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrdenTrabajoRequest(
    @NotNull Long idCliente,
    @NotNull Long idDispositivo,
    Long idTecnico,
    @Size(max = 500) String problemaReportado,
    @Size(max = 300) String observaciones
) {

}
