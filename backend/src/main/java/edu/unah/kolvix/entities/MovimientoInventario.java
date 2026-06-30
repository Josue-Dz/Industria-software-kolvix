package edu.unah.kolvix.entities;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import edu.unah.kolvix.enums.TipoMovimientoInventario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "movimientos_inventario")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MovimientoInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false)
    private TipoMovimientoInventario tipoMovimiento;

    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario = BigDecimal.ZERO;

    private String observacion;

    @CreationTimestamp
    @Column(name = "fecha_movimiento", nullable = false, updatable = false)
    private OffsetDateTime fechaMovimiento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_repuesto", nullable = false)
    private Repuesto repuesto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden")
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

}
