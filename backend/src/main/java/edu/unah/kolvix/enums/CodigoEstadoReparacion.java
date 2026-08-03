package edu.unah.kolvix.enums;

/**
 * Identidad estable de las etapas del flujo estandar.
 *
 * El nombre del estado lo edita cada taller, asi que no sirve para decidir
 * logica. El codigo si: es el que dispara notificaciones y consumo de stock.
 * Un estado creado a mano por el taller no tiene codigo.
 */
public enum CodigoEstadoReparacion {
    RECEPCION,
    DIAGNOSTICO,
    COTIZACION,
    EN_REPARACION,
    CONTROL_CALIDAD,
    LISTO_ENTREGA,
    ENTREGADO,
    CANCELADO
}
