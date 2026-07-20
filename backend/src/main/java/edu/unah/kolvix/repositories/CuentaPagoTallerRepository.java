package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.CuentaPagoTaller;

public interface CuentaPagoTallerRepository extends JpaRepository<CuentaPagoTaller, Long> {

    List<CuentaPagoTaller> findByEmpresaIdEmpresaAndActivoTrueOrderByBancoAsc(Long empresaId);

    Optional<CuentaPagoTaller> findByIdCuentaAndEmpresaIdEmpresa(Long idCuenta, Long empresaId);
}
