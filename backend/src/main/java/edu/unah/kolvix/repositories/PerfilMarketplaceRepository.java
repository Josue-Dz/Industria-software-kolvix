package edu.unah.kolvix.repositories;

import java.util.List;
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

    // búsqueda por categoría, solo talleres visibles
    @org.springframework.data.jpa.repository.Query("""
            SELECT p FROM PerfilMarketplace p
            WHERE p.marketplaceVisible = true
            AND p.empresa.idEmpresa IN (
                SELECT cs.empresa.idEmpresa FROM CategoriaServicio cs WHERE cs.categoria.idCategoria = :categoriaId
            )
            ORDER BY p.calificacionPromedio DESC, p.totalReviews DESC
            """)
    Page<PerfilMarketplace> buscarPorCategoria(@org.springframework.data.repository.query.Param("categoriaId") Integer categoriaId, Pageable pageable);

    // búsqueda por cercanía (Haversine), solo talleres visibles con coordenadas
    @org.springframework.data.jpa.repository.Query(value = """
            WITH distancias AS (
                SELECT p.id_marketplace,
                       (6371 * acos(
                           cos(radians(:lat)) * cos(radians(p.latitud)) *
                           cos(radians(p.longitud) - radians(:lng)) +
                           sin(radians(:lat)) * sin(radians(p.latitud))
                       )) AS distancia_km
                FROM perfiles_marketplace p
                WHERE p.marketplace_visible = true
                  AND p.latitud IS NOT NULL
                  AND p.longitud IS NOT NULL
            )
            SELECT id_marketplace, distancia_km
            FROM distancias
            WHERE distancia_km <= :radioKm
            ORDER BY distancia_km ASC
            """, nativeQuery = true)
    List<Object[]> buscarPorUbicacion(@org.springframework.data.repository.query.Param("lat") java.math.BigDecimal lat,
                                       @org.springframework.data.repository.query.Param("lng") java.math.BigDecimal lng,
                                       @org.springframework.data.repository.query.Param("radioKm") Double radioKm);
}
