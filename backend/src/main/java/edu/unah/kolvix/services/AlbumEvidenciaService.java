package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.unah.kolvix.dtos.catalogo.AlbumEvidenciaResponse;
import edu.unah.kolvix.repositories.AlbumEvidenciaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlbumEvidenciaService {

    private final AlbumEvidenciaRepository albumEvidenciaRepository;

    @Transactional(readOnly = true)
    public List<AlbumEvidenciaResponse> listarActivos() {
        return albumEvidenciaRepository.findByActivoTrueOrderByOrdenAsc()
                .stream()
                .map(album -> new AlbumEvidenciaResponse(
                        album.getIdAlbum(),
                        album.getCodigo(),
                        album.getTitulo(),
                        album.getDescripcion(),
                        album.isObligatorio(),
                        album.getOrden(),
                        album.isActivo()))
                .toList();
    }
}
