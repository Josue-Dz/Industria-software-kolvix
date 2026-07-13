package edu.unah.kolvix.entities;

import java.time.OffsetDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import edu.unah.kolvix.enums.TipoCuenta;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cuentas_cobro")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CuentaCobro {

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
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

}
