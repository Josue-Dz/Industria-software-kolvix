package edu.unah.kolvix.entities;

import java.time.Instant;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "entregas")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entrega")
    private Long id;

    @Column(name = "identidad_verificada", nullable = false)
    private boolean identidadVerificada;

    @Column(name = "url_comprobante_entrega", length = 255)
    private String urlComprobanteEntrega;

    private String observaciones;

    @CreationTimestamp
    @Column(name = "fecha_entrega", nullable = false, updatable = false)
    private Instant fechaEntrega;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_orden", nullable = false, unique = true)
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario_entrega", nullable = false)
    private Usuario usuarioEntrega;

}
