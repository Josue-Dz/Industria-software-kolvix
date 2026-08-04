package edu.unah.kolvix.dtos.usuario;

public record CargaTecnicoResponse(
        Long idTecnico,
        String nombre,
        String apellido,
        long ordenesActivas
) {
}
