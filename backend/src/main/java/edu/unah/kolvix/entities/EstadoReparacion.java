package edu.unah.kolvix.entities;

import edu.unah.kolvix.enums.CodigoEstadoReparacion;
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
@Table(name = "estados_reparacion")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EstadoReparacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado")
    private Integer idEstado;

    private String nombre;

    // Null en los estados que el taller crea a mano.
    @Enumerated(EnumType.STRING)
    @Column(name = "codigo", length = 30)
    private CodigoEstadoReparacion codigo;

    @Column(name = "color_hex")
    private String colorHex = "#6B7280";

    private Short orden;

    @Column(name = "es_estado_final")
    private Boolean esEstadoFinal;

    @Column(name = "notificar_cliente")
    private Boolean notificarCliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;
}
