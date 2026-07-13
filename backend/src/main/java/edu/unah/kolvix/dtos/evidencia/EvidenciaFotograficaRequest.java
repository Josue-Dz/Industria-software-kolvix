package edu.unah.kolvix.dtos.evidencia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EvidenciaFotograficaRequest(
        @NotNull Long ordenId,
        @NotNull Short albumId,
        Long usuarioSubidaId,
        @Size(max = 50) String etiqueta,
        @NotBlank @Size(max = 255) String urlImagen,
        @Size(max = 255) String descripcion,
        boolean obligatorio,
        short orden
) {
}
