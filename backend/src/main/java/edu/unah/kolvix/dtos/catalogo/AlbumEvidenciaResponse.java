package edu.unah.kolvix.dtos.catalogo;

import edu.unah.kolvix.enums.AlbumEvidenciaCodigo;

public record AlbumEvidenciaResponse(
        Short id,
        AlbumEvidenciaCodigo codigo,
        String titulo,
        String descripcion,
        boolean obligatorio,
        short orden,
        boolean activo
) {
}
