package edu.unah.kolvix.dtos.evidencia;

import java.time.Instant;

import edu.unah.kolvix.enums.AlbumEvidenciaCodigo;

public record EvidenciaFotograficaResponse(
        Long id,
        Long ordenId,
        short albumId,
        AlbumEvidenciaCodigo albumCodigo,
        String albumTitulo,
        Long usuarioSubidaId,
        String usuarioSubidaNombre,
        String etiqueta,
        String urlImagen,
        String descripcion,
        boolean obligatorio,
        short orden,
        Instant fechaSubida
) {
}
