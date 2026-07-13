package edu.unah.kolvix.dtos.notificacion;

import java.time.OffsetDateTime;

import edu.unah.kolvix.enums.CanalNotificacion;
import edu.unah.kolvix.enums.EstadoNotificacion;

public record NotificacionResponse(
        Long id,
        Long empresaId,
        Long ordenId,
        Long clienteId,
        CanalNotificacion canal,
        String destinatario,
        String asunto,
        String cuerpo,
        EstadoNotificacion estado,
        OffsetDateTime fechaProgramada,
        OffsetDateTime fechaEnvio,
        short intentos,
        String errorEnvio
) {
}
