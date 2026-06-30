package edu.unah.kolvix.entities;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import edu.unah.kolvix.enums.ResultadoControlCalidad;
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
@Table(name = "controles_calidad")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ControlCalidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_control")
    private Long idControl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "pruebas_realizadas", nullable = false, columnDefinition = "jsonb")
    private List<Map<String, Object>> pruebasRealizadas = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_general", nullable = false, length = 20)
    private ResultadoControlCalidad resultadoGeneral = ResultadoControlCalidad.PENDIENTE;

    private String observaciones;

    @CreationTimestamp
    @Column(name = "fecha_control")
    private Instant fechaControl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_orden", nullable = false)
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

}
