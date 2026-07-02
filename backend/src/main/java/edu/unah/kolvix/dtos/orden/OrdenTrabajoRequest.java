package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrdenTrabajoRequest(
    @NotNull Long idCliente,
    @NotNull Long idDispositivo,
    Long idTecnico,
    @NotBlank @Size(max = 20) String numeroOrden,
    @NotBlank @Size(max = 20) String codigoSeguimiento,
    @NotBlank @Size(max = 500) String problemaReportado,
    @Size(max = 300) String observaciones
) {

}
