package edu.unah.kolvix.repositories;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.MovimientoInventario;
import edu.unah.kolvix.enums.TipoMovimientoInventario;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    List<MovimientoInventario> findByRepuestoEmpresaIdEmpresaOrderByFechaMovimientoDesc(Long empresaId);

    List<MovimientoInventario> findByRepuestoEmpresaIdEmpresaAndRepuestoIdRepuestoOrderByFechaMovimientoDesc(
            Long empresaId,
            Long repuestoId
    );

    List<MovimientoInventario> findByRepuestoEmpresaIdEmpresaAndTipoMovimientoOrderByFechaMovimientoDesc(
            Long empresaId,
            TipoMovimientoInventario tipoMovimiento
    );

    List<MovimientoInventario> findByRepuestoEmpresaIdEmpresaAndFechaMovimientoBetweenOrderByFechaMovimientoDesc(
            Long empresaId,
            OffsetDateTime desde,
            OffsetDateTime hasta
    );
}
