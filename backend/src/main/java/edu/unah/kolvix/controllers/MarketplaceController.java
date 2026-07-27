package edu.unah.kolvix.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.unah.kolvix.dtos.catalogo.TallerCercanoResponse;
import edu.unah.kolvix.dtos.marketplace.CategoriaServicioResponse;
import edu.unah.kolvix.dtos.marketplace.PerfilMarketplaceResponse;
import edu.unah.kolvix.dtos.marketplace.ReviewResponse;
import edu.unah.kolvix.services.CategoriaServicioService;
import edu.unah.kolvix.services.MarketplaceService;
import edu.unah.kolvix.services.ReviewService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {
    
    
    private final MarketplaceService marketplaceService;
    private final CategoriaServicioService categoriaServicioService;
    private final ReviewService reviewService;

    @GetMapping("/talleres")
    public ResponseEntity<Page<PerfilMarketplaceResponse>> listar(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(marketplaceService.listarVisibles(pageable));
    }

    @GetMapping("/talleres/buscar")
    public ResponseEntity<Page<PerfilMarketplaceResponse>> buscarPorCategoria(
            @RequestParam Integer categoriaId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(marketplaceService.buscarPorCategoria(categoriaId, pageable));
    }

    @GetMapping("/talleres/cercanos")
    public ResponseEntity<List<TallerCercanoResponse>> buscarPorUbicacion(
            @RequestParam BigDecimal lat,
            @RequestParam BigDecimal lng,
            @RequestParam(defaultValue = "10") Double radioKm) {
        return ResponseEntity.ok(marketplaceService.buscarPorUbicacion(lat, lng, radioKm));
    }

    @GetMapping("/talleres/{idEmpresa}")
    public ResponseEntity<PerfilMarketplaceResponse> verPerfil(@PathVariable Long idEmpresa) {
        return ResponseEntity.ok(marketplaceService.verPerfilPublico(idEmpresa));
    }

    @GetMapping("/talleres/{idEmpresa}/categorias")
    public ResponseEntity<List<CategoriaServicioResponse>> categoriasDelTaller(@PathVariable Long idEmpresa) {
        return ResponseEntity.ok(categoriaServicioService.listar(idEmpresa));
    }

    @GetMapping("/talleres/{idEmpresa}/reviews")
    public ResponseEntity<List<ReviewResponse>> reviewsDelTaller(@PathVariable Long idEmpresa) {
        return ResponseEntity.ok(reviewService.listarPorTaller(idEmpresa));
}
}
