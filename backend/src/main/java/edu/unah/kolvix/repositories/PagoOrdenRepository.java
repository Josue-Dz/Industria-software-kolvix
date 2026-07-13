package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.PagoOrden;
import edu.unah.kolvix.enums.EstadoPagoComprobante;

public interface PagoOrdenRepository extends JpaRepository<PagoOrden, Long> {

    @EntityGraph(attributePaths = {"orden", "cuenta", "usuarioVerifica"})
    Optional<PagoOrden> findByIdPagoAndEmpresaIdEmpresa(Long idPago, Long empresaId);

    List<PagoOrden> findByEmpresaIdEmpresaAndOrdenIdOrdenOrderByFechaSubidaDesc(Long empresaId, Long ordenId);

    List<PagoOrden> findByEmpresaIdEmpresaAndEstadoOrderByFechaSubidaAsc(
            Long empresaId,
            EstadoPagoComprobante estado
    );
}
