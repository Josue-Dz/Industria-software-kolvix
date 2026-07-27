package edu.unah.kolvix.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.catalogo.TallerCercanoResponse;
import edu.unah.kolvix.dtos.marketplace.PerfilMarketplaceResponse;
import edu.unah.kolvix.entities.PerfilMarketplace;
import edu.unah.kolvix.repositories.PerfilMarketplaceRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarketplaceService {
    
        private final PerfilMarketplaceRepository perfilMarketplaceRepository;
    private final PerfilMarketplaceService perfilMarketplaceService;

    public Page<PerfilMarketplaceResponse> listarVisibles(Pageable pageable) {
        return perfilMarketplaceRepository
                .findByMarketplaceVisibleTrueOrderByCalificacionPromedioDescTotalReviewsDesc(pageable)
                .map(perfilMarketplaceService::mapearResponse);
    }

    public Page<PerfilMarketplaceResponse> buscarPorCategoria(Integer categoriaId, Pageable pageable) {
        return perfilMarketplaceRepository.buscarPorCategoria(categoriaId, pageable)
                .map(perfilMarketplaceService::mapearResponse);
    }

    public List<TallerCercanoResponse> buscarPorUbicacion(BigDecimal lat, BigDecimal lng, Double radioKm) {
        List<Object[]> resultados = perfilMarketplaceRepository.buscarPorUbicacion(lat, lng, radioKm);

        return resultados.stream().map(fila -> {
            Long idMarketplace = ((Number) fila[0]).longValue();
            Double distancia = ((Number) fila[1]).doubleValue();
            PerfilMarketplace perfil = perfilMarketplaceRepository.findById(idMarketplace)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil no encontrado"));
            return new TallerCercanoResponse(perfilMarketplaceService.mapearResponse(perfil), distancia);
        }).toList();
    }

    public PerfilMarketplaceResponse verPerfilPublico(Long idEmpresa) {
        PerfilMarketplace perfil = perfilMarketplaceRepository.findByEmpresaIdEmpresa(idEmpresa)
                .filter(PerfilMarketplace::isMarketplaceVisible)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Taller no encontrado o no visible"));
        return perfilMarketplaceService.mapearResponse(perfil);
    }
}
