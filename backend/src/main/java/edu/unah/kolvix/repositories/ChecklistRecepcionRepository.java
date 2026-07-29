package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.ChecklistRecepcion;

public interface ChecklistRecepcionRepository extends JpaRepository<ChecklistRecepcion, Long> {

    @EntityGraph(attributePaths = {"orden", "usuario", "plantillaInspeccion"})
    Optional<ChecklistRecepcion> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresa(Long ordenId, Long empresaId);

    // Para comprobar que un checklist pertenece a la empresa en sesion.
    Optional<ChecklistRecepcion> findByIdChecklistAndOrdenEmpresaIdEmpresa(Long idChecklist, Long empresaId);

    boolean existsByOrden_IdOrden(Long ordenId);
}
