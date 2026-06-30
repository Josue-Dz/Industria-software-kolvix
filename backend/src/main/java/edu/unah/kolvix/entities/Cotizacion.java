package edu.unah.kolvix.entities;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import edu.unah.kolvix.enums.EstadoCotizacion;
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
@Table(name = "cotizaciones")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Cotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cotizacion")
    private Long idCotizacion;

    @Column(name = "version", nullable = false)
    private short version = 1;

    @Column(name = "monto_mano_obra", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoManoObra = BigDecimal.ZERO;

    @Column(name = "monto_repuestos", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoRepuestos = BigDecimal.ZERO;

    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal = BigDecimal.ZERO;

    @Column(name = "tiempo_estimado_horas", precision = 5, scale = 2)
    private BigDecimal tiempoEstimadoHoras;

    @Enumerated(EnumType.STRING)
    private EstadoCotizacion estado = EstadoCotizacion.PENDIENTE;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private Instant fechaCreacion;

    @Column(name = "fecha_envio")
    private Instant fechaEnvio;

    @Column(name = "fecha_respuesta")
    private Instant fechaRespuesta;

    @Column(name = "observacion_cliente", length = 500)
    private String observacionCliente;

    @Column(name = "observacion_interna", length = 500)
    private String observacionInterna;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_orden", nullable = false)
    private OrdenTrabajo orden;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_diagnostico", nullable = false, unique = true)
    private Diagnostico diagnostico;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario_creador", nullable = false)
    private Usuario usuarioCreador;

}
