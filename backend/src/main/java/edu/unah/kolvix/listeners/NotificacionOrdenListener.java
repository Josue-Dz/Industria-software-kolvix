package edu.unah.kolvix.listeners;

import edu.unah.kolvix.services.KolvixMail;
import edu.unah.kolvix.events.OrdenListaEntregaEvent;
import edu.unah.kolvix.entities.OrdenTrabajo;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificacionOrdenListener {
    
    private final KolvixMail kolvixMail;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrdenListaEntregaEvent(OrdenListaEntregaEvent event) {
        OrdenTrabajo ordenTrabajo = event.ordenTrabajo();
        String mensaje = event.mensaje();

        // Aquí puedes obtener el correo del cliente asociado a la orden de trabajo
        String correoCliente = ordenTrabajo.getCliente().getCorreo();

        // Enviar el correo al cliente
        kolvixMail.sendEmail(correoCliente, "Orden Lista para Entrega", mensaje);
        log.info("Notificación enviada al cliente: {}", correoCliente);
    }
}
