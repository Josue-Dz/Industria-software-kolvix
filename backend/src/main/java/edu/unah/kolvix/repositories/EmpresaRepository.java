package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Long>{

    @EntityGraph(attributePaths = {"planSuscripcion"})
    Optional<Empresa> findByIdEmpresa(Long idEmpresa);

    Page<Empresa> findAllByOrderByFechaRegistroDesc(Pageable pageable);

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByRtn(String rtn);

}
