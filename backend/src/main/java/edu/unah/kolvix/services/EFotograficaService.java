package edu.unah.kolvix.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.repositories.AlbumEvidenciaRepository;
import edu.unah.kolvix.repositories.EvidenciaFotograficaRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import edu.unah.kolvix.repositories.UsuarioRepository;
import java.util.List;
import edu.unah.kolvix.dtos.evidencia.EvidenciaFotograficaRequest;
import edu.unah.kolvix.dtos.evidencia.EvidenciaFotograficaResponse;
import edu.unah.kolvix.entities.EvidenciaFotografica;
import edu.unah.kolvix.entities.AlbumEvidencia;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class EFotograficaService {
    
    private final EvidenciaFotograficaRepository evidenciaFotograficaRepository;
    private final AlbumEvidenciaRepository albumEvidenciaRepository;
    private final UsuarioRepository UsuarioRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    // Recepcionista sube evidencia fotografica de la orden. Validar que el usuario es recepcionista y que la orden existe.
    public EvidenciaFotograficaResponse subirEvidenciaFotografica(EvidenciaFotograficaRequest request) {
        // Validaciones 
        AlbumEvidencia album = albumEvidenciaRepository.findById(request.albumId())
                .orElseThrow(() -> new IllegalArgumentException("El album no existe"));

        Usuario usuario = UsuarioRepository.findById(request.usuarioSubidaId())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));
        if (usuario.getRol() != RolUsuario.RECEPCIONISTA) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario asignado no tiene el rol de recepcionista");
        }
        OrdenTrabajo orden = ordenTrabajoRepository.findById(request.ordenId())
                .orElseThrow(() -> new IllegalArgumentException("La orden no existe"));
        // Registrar Fotografia
        EvidenciaFotografica evidencia = new EvidenciaFotografica();
        evidencia.setEtiqueta(request.etiqueta());
        evidencia.setUrlImagen(request.urlImagen());
        evidencia.setDescripcion(request.descripcion());
        evidencia.setObligatorio(request.obligatorio());
        evidencia.setAlbum(album);
        evidencia.setOrden(orden);
        evidencia.setUsuarioSubida(usuario);
        evidenciaFotograficaRepository.save(evidencia);

        //Mapeo de Response
        return mapToResponse(evidencia);
        
    }

    public EvidenciaFotograficaResponse AsignarAlbumId(long evidenciaId, short albumId) {
        AlbumEvidencia album = albumEvidenciaRepository.findById(albumId)
                .orElseThrow(() -> new IllegalArgumentException("El album no existe"));

        EvidenciaFotografica evidencia = evidenciaFotograficaRepository.findById(evidenciaId)
                .orElseThrow(() -> new IllegalArgumentException("La evidencia no existe"));

        evidencia.setAlbum(album);
        evidenciaFotograficaRepository.save(evidencia);

        return mapToResponse(evidencia);
    }

    private EvidenciaFotograficaResponse mapToResponse(EvidenciaFotografica evidencia) {
        return new EvidenciaFotograficaResponse(
              evidencia.getIdEvidencia(),
              evidencia.getOrden().getIdOrden(),
              evidencia.getAlbum().getIdAlbum(),
              evidencia.getAlbum().getCodigo(),
              evidencia.getAlbum().getTitulo(),
              evidencia.getUsuarioSubida() != null ? evidencia.getUsuarioSubida().getIdUsuario() : null,
              evidencia.getUsuarioSubida() != null ? evidencia.getUsuarioSubida().getNombre() : null,
              evidencia.getEtiqueta(),
              evidencia.getUrlImagen(),
              evidencia.getDescripcion(),
              evidencia.isObligatorio(),
              evidencia.getOrdenVisual(),
              evidencia.getFechaSubida() != null ? evidencia.getFechaSubida().toInstant() : null
        );
    }

    public List<EvidenciaFotograficaResponse> buscarEvidenciasPorOrdenId(Long ordenId) {
        OrdenTrabajo orden = ordenTrabajoRepository.findById(ordenId)
                .orElseThrow(() -> new IllegalArgumentException("La orden con ID " + ordenId + " no existe"));

        Empresa empresa = orden.getEmpresa();
        List<EvidenciaFotografica> evidencias = evidenciaFotograficaRepository.findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByAlbumOrdenAscOrdenVisualAsc(orden.getIdOrden(),empresa.getIdEmpresa());

        return evidencias.stream()
                .map(this::mapToResponse)
                .toList();
    }

}
