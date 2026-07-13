package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.RepuestoOrden;

public interface RepuestoOrdenRepository extends JpaRepository<RepuestoOrden, Long> {

    List<RepuestoOrden> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByIdAsc(Long ordenId, Long empresaId);

    Optional<RepuestoOrden> findByIdAndOrdenEmpresaIdEmpresa(Long id, Long empresaId);
}
