package edu.unah.kolvix.entities;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import edu.unah.kolvix.enums.ComplejidadDiagnostico;
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
@Table(name = "diagnosticos")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Diagnostico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_diagnostico")
    private Long idDiagnostico;

    @Column(name = "problema_encontrado")
    private String problemaEncontrado;

    @Column(name = "causa_raiz")
    private String causaRaiz;

    @Column(name = "tiempo_estimado")
    private BigDecimal tiempoEstimado;

    // @Column(name = "costo_estimado")
    // private BigDecimal costoEstimado;

    @Enumerated(EnumType.STRING)
    @Column(name = "complejidad", length = 20)
    private ComplejidadDiagnostico complejidad;

    @CreationTimestamp
    @Column(name = "fecha_diagnostico")
    private Instant fechaDiagnostico;

    @Column(name = "observaciones_adicionales")
    private String observacionesAdicionales;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_orden", nullable = false)
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_tecnico", nullable = false)
    private Tecnico tecnico;
}
