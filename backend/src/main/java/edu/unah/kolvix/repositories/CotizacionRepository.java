package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Cotizacion;
import edu.unah.kolvix.enums.EstadoCotizacion;

public interface CotizacionRepository extends JpaRepository<Cotizacion, Long> {

    @EntityGraph(attributePaths = {"orden", "diagnostico", "usuarioCreador"})
    Optional<Cotizacion> findByIdCotizacionAndEmpresaIdEmpresa(Long idCotizacion, Long empresaId);

    List<Cotizacion> findByOrdenIdOrdenAndEmpresaIdEmpresaOrderByVersionDesc(Long ordenId, Long empresaId);

    List<Cotizacion> findByEmpresaIdEmpresaAndEstadoOrderByFechaCreacionDesc(
            Long empresaId,
            EstadoCotizacion estado
    );
}
