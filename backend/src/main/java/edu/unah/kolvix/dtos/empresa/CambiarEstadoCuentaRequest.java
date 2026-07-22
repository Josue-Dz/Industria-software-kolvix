package edu.unah.kolvix.dtos.empresa;

import jakarta.validation.constraints.NotNull;

public record CambiarEstadoCuentaRequest(@NotNull Boolean activo) {}
