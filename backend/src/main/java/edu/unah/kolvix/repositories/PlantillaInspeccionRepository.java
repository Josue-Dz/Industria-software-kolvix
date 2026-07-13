package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.PlantillaInspeccion;

public interface PlantillaInspeccionRepository extends JpaRepository<PlantillaInspeccion, Long> {

    List<PlantillaInspeccion> findByActivoTrueOrderByNombreAsc();

    List<PlantillaInspeccion> findByCategoriaIdCategoriaAndActivoTrueOrderByNombreAsc(Integer categoriaId);

    Optional<PlantillaInspeccion> findByIdPlantillaAndActivoTrue(Long idPlantilla);
}
