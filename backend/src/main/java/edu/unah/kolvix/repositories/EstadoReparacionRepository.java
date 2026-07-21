package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.EstadoReparacion;

public interface EstadoReparacionRepository extends JpaRepository<EstadoReparacion, Integer> {

    List<EstadoReparacion> findByEmpresaIdEmpresaOrderByOrdenAsc(Long empresaId);

    Optional<EstadoReparacion> findByIdEstadoAndEmpresaIdEmpresa(Integer idEstado, Long empresaId);

    boolean existsByEmpresaIdEmpresaAndNombreIgnoreCase(Long empresaId, String nombre);
}
