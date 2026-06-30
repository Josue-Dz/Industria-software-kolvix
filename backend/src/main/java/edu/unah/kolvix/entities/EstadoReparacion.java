package edu.unah.kolvix.entities;

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
@Table(name = "estados_reparacion")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EstadoReparacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado")
    private Integer id_estado;

    private String nombre;

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
