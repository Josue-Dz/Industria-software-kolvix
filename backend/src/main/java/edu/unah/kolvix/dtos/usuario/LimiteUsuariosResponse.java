package edu.unah.kolvix.dtos.usuario;

// Cupo de usuarios del plan contratado. maxUsuarios en null significa ilimitado.
public record LimiteUsuariosResponse(
        int usuariosActivos,
        Integer maxUsuarios,
        boolean ilimitado,
        boolean cupoDisponible,
        String nombrePlan
) {
}
