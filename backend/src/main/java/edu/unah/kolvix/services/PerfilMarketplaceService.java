package edu.unah.kolvix.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.marketplace.PerfilMarketplaceRequest;
import edu.unah.kolvix.dtos.marketplace.PerfilMarketplaceResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.PerfilMarketplace;
import edu.unah.kolvix.repositories.PerfilMarketplaceRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PerfilMarketplaceService {
    
        private final PerfilMarketplaceRepository perfilMarketplaceRepository;

    public PerfilMarketplaceResponse obtenerPropio(Long empresaId) {
        PerfilMarketplace perfil = perfilMarketplaceRepository.findByEmpresaIdEmpresa(empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Aún no has creado tu perfil de marketplace"));
        return mapearResponse(perfil);
    }

    @Transactional
    public PerfilMarketplaceResponse guardar(PerfilMarketplaceRequest request, Empresa empresa) {
        PerfilMarketplace perfil = perfilMarketplaceRepository.findByEmpresaIdEmpresa(empresa.getIdEmpresa())
                .orElseGet(() -> {
                    PerfilMarketplace nuevo = new PerfilMarketplace();
                    nuevo.setEmpresa(empresa);
                    return nuevo;
                });

        perfil.setDescripcionPublica(request.descripcionPublica());
        perfil.setHorarioAtencion(request.horarioAtencion());
        perfil.setLatitud(request.latitud());
        perfil.setLongitud(request.longitud());
        perfil.setMarketplaceVisible(request.marketplaceVisible());

        perfil = perfilMarketplaceRepository.save(perfil);
        return mapearResponse(perfil);
    }

    @Transactional
    public PerfilMarketplaceResponse cambiarVisibilidad(Long empresaId, boolean visible) {
        PerfilMarketplace perfil = perfilMarketplaceRepository.findByEmpresaIdEmpresa(empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Aún no has creado tu perfil de marketplace"));
        perfil.setMarketplaceVisible(visible);
        perfil = perfilMarketplaceRepository.save(perfil);
        return mapearResponse(perfil);
    }

    // público (no private) porque MarketplaceService también lo reutiliza
    public PerfilMarketplaceResponse mapearResponse(PerfilMarketplace perfil) {
        Empresa empresa = perfil.getEmpresa();
        return new PerfilMarketplaceResponse(
                perfil.getIdMarketplace(),
                empresa.getIdEmpresa(),
                empresa.getNombre(),
                empresa.getTelefono(),
                empresa.getCorreo(),
                empresa.getDireccion(),
                perfil.getDescripcionPublica(),
                perfil.getHorarioAtencion(),
                perfil.getLatitud(),
                perfil.getLongitud(),
                perfil.isMarketplaceVisible(),
                perfil.getCalificacionPromedio(),
                perfil.getTotalReviews(),
                perfil.getFechaActualizacion() != null ? perfil.getFechaActualizacion().toInstant() : null
        );
    }
}
