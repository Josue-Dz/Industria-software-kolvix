package edu.unah.kolvix.entities;

import java.time.Instant;

import org.hibernate.annotations.UpdateTimestamp;

import edu.unah.kolvix.enums.TipoCuenta;
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
@Table(name = "cuentas_pago_taller")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CuentaPagoTaller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuenta")
    private Long idCuenta;
    
    private String banco;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cuenta", nullable = false)
    private TipoCuenta tipoCuenta = TipoCuenta.AHORRO;

    @Column(name = "numero_cuenta", nullable = false)
    private String numeroCuenta;

    private String titular;

    @Column(length = 3)
    private String moneda = "HNL";

    private String instrucciones;

    private boolean activo = true;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

}
