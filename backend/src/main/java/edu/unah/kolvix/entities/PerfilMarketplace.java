package edu.unah.kolvix.entities;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "perfiles_marketplace")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PerfilMarketplace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_marketplace")
    private Long id;

    @Column(name = "descripcion_publica")
    private String descripcionPublica;

    @Column(name = "horario_atencion")
    private String horarioAtencion;

    private BigDecimal latitud;

    private BigDecimal longitud;

    @Column(name = "marketplace_visible")
    private boolean marketplaceVisible;

    @Column(name = "calificacion_promedio")
    private BigDecimal calificacionPromedio = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private OffsetDateTime fechaActualizacion;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = false, unique = true)
    private Empresa empresa;

}
