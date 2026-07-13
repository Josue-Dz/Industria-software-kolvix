package edu.unah.kolvix.entities;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import edu.unah.kolvix.enums.EstadoFisicoGeneral;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "checklists_recepcion")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChecklistRecepcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_checklist")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_fisico_general", length = 30)
    private EstadoFisicoGeneral estadoFisicoGeneral;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "danos_fisicos", nullable = false, columnDefinition = "jsonb")
    private List<Map<String, Object>> danosFisicos = new ArrayList<>();

    private String observaciones;

    @Column(name = "aceptacion_cliente", nullable = false)
    private boolean aceptacionCliente;

    @Column(name = "url_documento_aceptacion", length = 255)
    private String urlDocumentoAceptacion;

    @Column(name = "fecha_aceptacion")
    private Instant fechaAceptacion;

    @CreationTimestamp
    @Column(name = "fecha", nullable = false, updatable = false)
    private Instant fecha;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_orden", nullable = false, unique = true)
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_plantilla_inspeccion")
    private PlantillaInspeccion plantillaInspeccion;

}
