package edu.unah.kolvix.model;

import edu.unah.kolvix.enums.TipoDanoFisico;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Una marca sobre el chasis dentro de checklists_recepcion.danos_fisicos.
 * x e y van en porcentaje del area dibujada para que la marca caiga en el
 * mismo punto sin importar el tamano de pantalla.
 */
public record DanoFisico(
        @NotBlank @Size(max = 30) String vista,
        @DecimalMin("0.0") @DecimalMax("100.0") double x,
        @DecimalMin("0.0") @DecimalMax("100.0") double y,
        @NotNull TipoDanoFisico tipo,
        @Size(max = 160) String nota
) {
}
