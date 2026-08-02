package edu.unah.kolvix.events;

import edu.unah.kolvix.entities.OrdenTrabajo;

public record OrdenListaEntregaEvent(
    OrdenTrabajo ordenTrabajo,
    String mensaje
) {}
