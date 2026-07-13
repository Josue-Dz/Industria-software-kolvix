package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.PerfilMarketplace;

public interface PerfilMarketplaceRepository extends JpaRepository<PerfilMarketplace, Long> {

    @EntityGraph(attributePaths = {"empresa"})
    Optional<PerfilMarketplace> findByEmpresaIdEmpresa(Long empresaId);

    @EntityGraph(attributePaths = {"empresa"})
    Page<PerfilMarketplace> findByMarketplaceVisibleTrueOrderByCalificacionPromedioDescTotalReviewsDesc(
            Pageable pageable
    );
}
