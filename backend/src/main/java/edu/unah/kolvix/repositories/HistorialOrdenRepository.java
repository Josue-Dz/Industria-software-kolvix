package edu.unah.kolvix.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.HistorialOrden;

public interface HistorialOrdenRepository extends JpaRepository<HistorialOrden, Long> {

    @EntityGraph(attributePaths = {"usuario", "estadoAnterior", "estadoNuevo"})
    List<HistorialOrden> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByFechaAsc(Long ordenId, Long empresaId);
}
