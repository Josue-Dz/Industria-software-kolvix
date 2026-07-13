package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Repuesto;

public interface RepuestoRepository extends JpaRepository<Repuesto, Long> {

    Page<Repuesto> findByEmpresaIdEmpresaOrderByNombreAsc(Long empresaId, Pageable pageable);

    Optional<Repuesto> findByIdRepuestoAndEmpresaIdEmpresa(Long idRepuesto, Long empresaId);

    List<Repuesto> findByEmpresaIdEmpresaAndActivoTrueOrderByNombreAsc(Long empresaId);

    List<Repuesto> findByEmpresaIdEmpresaAndActivoTrueAndStockActualLessThanEqualOrderByStockActualAsc(
            Long empresaId,
            Integer stockMinimo
    );

    boolean existsByEmpresaIdEmpresaAndCodigo(Long empresaId, String codigo);
}
