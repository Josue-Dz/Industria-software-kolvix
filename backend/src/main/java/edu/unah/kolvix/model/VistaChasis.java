package edu.unah.kolvix.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Una cara del dispositivo dentro de plantillas_inspeccion.vistas.
 * El codigo lo usa el frontend para elegir que silueta SVG dibujar.
 */
public record VistaChasis(
        @NotBlank @Size(max = 30) String codigo,
        @NotBlank @Size(max = 60) String titulo,
        int orden
) {
}
