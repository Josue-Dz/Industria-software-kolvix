package edu.unah.kolvix.dtos.orden;

import jakarta.validation.constraints.NotNull;

public record CambiarOrdenRequest(@NotNull Short orden) {}
