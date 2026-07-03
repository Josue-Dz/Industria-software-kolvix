package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.enums.EstadoPagoOrden;

public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long>{

    @Query("SELECT o FROM OrdenTrabajo o WHERE o.idOrden = :idOrden AND o.empresa.idEmpresa = :empresaId")
    Optional<OrdenTrabajo> findByIdOrdenAndEmpresaId(@Param("idOrden") Long idOrden, @Param("empresaId") Long empresaId);

    @EntityGraph(attributePaths = {"cliente", "dispositivo", "tecnico", "estado"})
    Optional<OrdenTrabajo> findByCodigoSeguimiento(String codigoSeguimiento); // FIXED

    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM OrdenTrabajo o WHERE o.empresa.idEmpresa = :empresaId AND o.numeroOrden = :numeroOrden")
    boolean existsByEmpresaIdAndNumeroOrden(@Param("empresaId") Long empresaId, @Param("numeroOrden") String numeroOrden);
    
    boolean existByCodigoSeguimiento(String codigoSeguimiento);

    Page<OrdenTrabajo> findByEmpresaId(Long empresaId, Pageable pageable); // FIXED (findby → findBy)

    Page<OrdenTrabajo> findByEmpresaIdAndEstadoId(Long empresaId, Long estadoId, Pageable pageable);

    Page<OrdenTrabajo> findByEmpresaIdAndTecnicoId(Long empresaId, Long tecnicoId, Pageable pageable);

    List<OrdenTrabajo> findByEmpresaIdAndEstadoPago(Long empresaId, EstadoPagoOrden estadoPago);
}
