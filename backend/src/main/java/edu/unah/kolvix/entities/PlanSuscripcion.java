package edu.unah.kolvix.entities;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "planes_suscripcion")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PlanSuscripcion {

    @Id
    private String codigo;

    private String nombre;

    private String descripcion;

    @Column(name = "monto_mensual", nullable = false)
    private BigDecimal montoMensual = BigDecimal.ZERO;

    @Column(name = "moneda", nullable = false, length = 3)
    private String moneda = "HNL";

    @Column(name = "activo", nullable = false)
    private boolean activo = true;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}
