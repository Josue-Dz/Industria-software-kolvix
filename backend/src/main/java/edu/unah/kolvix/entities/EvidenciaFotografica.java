package edu.unah.kolvix.entities;

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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "evidencias_fotograficas")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EvidenciaFotografica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evidencia")
    private Long id;

    private String etiqueta;

    @Column(name = "url_imagen", nullable = false)
    private String urlImagen;

    private String descripcion;

    private boolean obligatorio;

    private short ordenVisual;

    @CreationTimestamp
    @Column(name = "fecha_subida", nullable = false, updatable = false)
    private OffsetDateTime fechaSubida;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_orden", nullable = false)
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_album", nullable = false)
    private AlbumEvidencia album;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_subida")
    private Usuario usuarioSubida;

}
