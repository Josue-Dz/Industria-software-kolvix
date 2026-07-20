package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.AlbumEvidencia;
import edu.unah.kolvix.enums.AlbumEvidenciaCodigo;

public interface AlbumEvidenciaRepository extends JpaRepository<AlbumEvidencia, Short> {

    List<AlbumEvidencia> findByActivoTrueOrderByOrdenAsc();

    Optional<AlbumEvidencia> findByCodigo(AlbumEvidenciaCodigo codigo);
}
