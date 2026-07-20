package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.DiagnosticoRepuesto;

public interface DiagnosticoRepuestoRepository extends JpaRepository<DiagnosticoRepuesto, Long> {

    List<DiagnosticoRepuesto> findByDiagnosticoIdDiagnosticoAndEmpresaIdEmpresaOrderByIdAsc(
            Long diagnosticoId,
            Long empresaId
    );

    Optional<DiagnosticoRepuesto> findByIdAndEmpresaIdEmpresa(Long id, Long empresaId);
}
