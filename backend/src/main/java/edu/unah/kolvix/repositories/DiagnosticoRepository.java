package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Diagnostico;
import edu.unah.kolvix.enums.ComplejidadDiagnostico;

public interface DiagnosticoRepository extends JpaRepository<Diagnostico, Long> {

    @EntityGraph(attributePaths = {"orden", "tecnico"})
    Optional<Diagnostico> findByOrdenIdOrdenAndEmpresaIdEmpresa(Long ordenId, Long empresaId);

    Optional<Diagnostico> findByIdDiagnosticoAndEmpresaIdEmpresa(Long idDiagnostico, Long empresaId);

    long countByEmpresaIdEmpresaAndComplejidad(Long empresaId, ComplejidadDiagnostico complejidad);
}
