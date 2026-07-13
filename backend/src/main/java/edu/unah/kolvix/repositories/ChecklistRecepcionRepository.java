package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.ChecklistRecepcion;

public interface ChecklistRecepcionRepository extends JpaRepository<ChecklistRecepcion, Long> {

    @EntityGraph(attributePaths = {"orden", "usuario", "plantillaInspeccion"})
    Optional<ChecklistRecepcion> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresa(Long ordenId, Long empresaId);
}
