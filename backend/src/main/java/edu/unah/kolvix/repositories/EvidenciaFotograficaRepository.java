package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.EvidenciaFotografica;
import edu.unah.kolvix.enums.AlbumEvidenciaCodigo;

public interface EvidenciaFotograficaRepository extends JpaRepository<EvidenciaFotografica, Long> {

    List<EvidenciaFotografica> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByAlbumOrdenAscOrdenVisualAsc(
            Long ordenId,
            Long empresaId
    );

    List<EvidenciaFotografica> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaAndAlbumCodigoOrderByOrdenVisualAsc(
            Long ordenId,
            Long empresaId,
            AlbumEvidenciaCodigo codigo
    );

    Optional<EvidenciaFotografica> findByIdEvidenciaAndOrdenEmpresaIdEmpresa(Long idEvidencia, Long empresaId);
}
