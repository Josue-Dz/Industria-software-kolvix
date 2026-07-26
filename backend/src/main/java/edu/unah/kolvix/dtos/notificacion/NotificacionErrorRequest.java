package edu.unah.kolvix.dtos.notificacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotificacionErrorRequest(
    @NotBlank @Size(max = 2000) String errorEnvio
) {

}
