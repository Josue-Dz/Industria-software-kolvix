package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Tecnico;

public interface TecnicoRepository extends JpaRepository<Tecnico, Long>{

    @EntityGraph(attributePaths = {"usuario"})
    Page<Tecnico> findByEmpresaIdEmpresaOrderByIdTecnicoDesc(Long empresaId, Pageable pageable);

    @EntityGraph(attributePaths = {"usuario"})
    Optional<Tecnico> findByIdTecnicoAndEmpresaIdEmpresa(Long idTecnico, Long empresaId);

    Page<Tecnico> findByEmpresaIdEmpresaAndActivoTrueOrderByUsuarioNombreAscUsuarioApellidoAsc(
            Long empresaId,
            Pageable pageable
    );

    boolean existsByEmpresaIdEmpresaAndDni(Long empresaId, String dni);

}
