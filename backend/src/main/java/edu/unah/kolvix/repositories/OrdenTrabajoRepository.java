package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.unah.kolvix.entities.EstadoReparacion;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.enums.EstadoPagoOrden;

public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long> {

    @Query("""
            select t.idTecnico as idTecnico, count(o.idOrden) as ordenesActivas
            from Tecnico t
            left join OrdenTrabajo o on o.tecnico = t and o.estado.esEstadoFinal = false
            where t.empresa.idEmpresa = :empresaId and t.activo = true
            group by t.idTecnico
            """)
    List<CargaTecnico> contarOrdenesActivasPorTecnico(Long empresaId);

    interface CargaTecnico {
        Long getIdTecnico();
        long getOrdenesActivas();
    }

    @EntityGraph(attributePaths = {"cliente", "dispositivo", "tecnico", "estado"})
    Optional<OrdenTrabajo> findByIdOrdenAndEmpresaIdEmpresa(Long id, Long empresaId);

    @EntityGraph(attributePaths = {"cliente", "dispositivo", "tecnico", "estado"})
    Optional<OrdenTrabajo> findByCodigoSeguimiento(String codigoSeguimiento); 

    boolean existsByEmpresaIdEmpresaAndNumeroOrden(Long empresaId, String numeroOrden);

    Optional<OrdenTrabajo> findByEmpresaIdEmpresaAndNumeroOrden(Long empresaId, String numeroOrden);

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


    List<OrdenTrabajo> findByEmpresaIdEmpresaAndEstadoIdEstadoOrderByFechaIngresoDesc (
                Long empresaId,
                Integer estadoId   
    );
}

