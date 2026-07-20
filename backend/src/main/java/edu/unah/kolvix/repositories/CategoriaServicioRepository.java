package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.CategoriaServicio;

public interface CategoriaServicioRepository extends JpaRepository<CategoriaServicio, Integer> {

    List<CategoriaServicio> findByEmpresaIdEmpresaOrderByCategoriaNombreAsc(Long empresaId);

    Optional<CategoriaServicio> findByIdAndEmpresaIdEmpresa(Integer idCategoriaServicio, Long empresaId);
}
