package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.EstadoReparacion;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.enums.EstadoPagoOrden;

public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long> {

    @EntityGraph(attributePaths = {"cliente", "dispositivo", "tecnico", "estado"})
    Optional<OrdenTrabajo> findByIdOrdenAndEmpresaIdEmpresa(Long id, Long empresaId);

    @EntityGraph(attributePaths = {"cliente", "dispositivo", "tecnico", "estado"})
    Optional<OrdenTrabajo> findByCodigoSeguimiento(String codigoSeguimiento); 

    boolean existsByEmpresaIdEmpresaAndNumeroOrden(Long empresaId, String numeroOrden);

    boolean existsByCodigoSeguimiento(String codigoSeguimiento);

    Page<OrdenTrabajo> findByEmpresaIdEmpresaOrderByFechaIngresoDesc(Long empresaId, Pageable pageable);

    Page<OrdenTrabajo> findByEmpresaIdEmpresaAndEstadoOrderByFechaIngresoDesc(
            Long empresaId,
            EstadoReparacion estado,
            Pageable pageable
    );

    Page<OrdenTrabajo> findByEmpresaIdEmpresaAndTecnicoIdTecnicoOrderByFechaIngresoDesc(
            Long empresaId,
            Long tecnicoId,
            Pageable pageable
    );

    List<OrdenTrabajo> findByEmpresaIdEmpresaAndEstadoPagoOrderByFechaIngresoDesc(
            Long empresaId,
            EstadoPagoOrden estadoPago
    );
}

