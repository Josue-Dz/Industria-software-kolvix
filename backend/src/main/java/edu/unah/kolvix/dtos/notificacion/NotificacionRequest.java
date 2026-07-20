package edu.unah.kolvix.dtos.notificacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

import edu.unah.kolvix.enums.CanalNotificacion;

public record NotificacionRequest(
        Long ordenId,
        Long clienteId,
        @NotNull CanalNotificacion canal,
        @NotBlank @Size(max = 200) String destinatario,
        @Size(max = 255) String asunto,
        @NotBlank String cuerpo,
        OffsetDateTime fechaProgramada
) {
}
