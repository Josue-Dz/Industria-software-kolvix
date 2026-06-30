package edu.unah.kolvix.entities;

import java.time.OffsetDateTime;

import edu.unah.kolvix.enums.CanalNotificacion;
import edu.unah.kolvix.enums.EstadoNotificacion;
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
@Table(name = "notificaciones")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Long id;

    @Enumerated(EnumType.STRING)
    private CanalNotificacion canal;

    private String destinatario;

    private String asunto;

    private String cuerpo;

    @Enumerated(EnumType.STRING)
    private EstadoNotificacion estado = EstadoNotificacion.PENDIENTE;

    @Column(name = "fecha_programada")
    private OffsetDateTime fechaProgramada;

    @Column(name = "fecha_envio")
    private OffsetDateTime fechaEnvio;

    private short intentos;

    @Column(name = "error_envio", columnDefinition = "text")
    private String errorEnvio;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden")
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

}
