package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.ControlCalidad;
import edu.unah.kolvix.enums.ResultadoControlCalidad;

public interface ControlCalidadRepository extends JpaRepository<ControlCalidad, Long> {

    List<ControlCalidad> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByFechaControlDesc(Long ordenId, Long empresaId);

    Optional<ControlCalidad> findByIdControlAndOrdenEmpresaIdEmpresa(Long idControl, Long empresaId);

    List<ControlCalidad> findByOrdenEmpresaIdEmpresaAndResultadoGeneralOrderByFechaControlDesc(
            Long empresaId,
            ResultadoControlCalidad resultadoGeneral
    );
}
