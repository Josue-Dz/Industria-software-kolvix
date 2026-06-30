package edu.unah.kolvix.entities;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import edu.unah.kolvix.enums.EstadoPagoComprobante;
import edu.unah.kolvix.enums.MetodoPagoOrden;
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
@Table(name = "pagos_orden")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PagoOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long id;

    private BigDecimal monto;

    private String moneda = "HNL";

    @Enumerated(EnumType.STRING)
    private MetodoPagoOrden metodo = MetodoPagoOrden.DEPOSITO;

    @Enumerated(EnumType.STRING)
    private EstadoPagoComprobante estado = EstadoPagoComprobante.PENDIENTE;

    private String referencia;

    @Column(name = "url_comprobante", nullable = false)
    private String urlComprobante;

    @Column(name = "observacion_cliente")
    private String observacionCliente;

    @Column(name = "observacion_taller")
    private String observacionTaller;

    @CreationTimestamp
    @Column(name = "fecha_subida", nullable = false, updatable = false)
    private Instant fechaSubida;

    @Column(name = "fecha_verificacion")
    private Instant fechaVerificacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_orden", nullable = false)
    private OrdenTrabajo orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuenta")
    private CuentaPagoTaller cuenta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_verifica")
    private Usuario usuarioVerifica;

}
