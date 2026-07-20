package edu.unah.kolvix.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.CategoriaDispositivo;

public interface CategoriaDispositivoRepository extends JpaRepository<CategoriaDispositivo, Integer> {

    List<CategoriaDispositivo> findAllByOrderByNombreAsc();
}
