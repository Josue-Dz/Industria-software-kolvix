package edu.unah.kolvix.dtos.usuario;

import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest (@NotNull Boolean activo){}
