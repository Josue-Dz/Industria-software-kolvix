package edu.unah.kolvix.services;

import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.PerfilMarketplace;
import edu.unah.kolvix.entities.Review;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import edu.unah.kolvix.repositories.PerfilMarketplaceRepository;
import edu.unah.kolvix.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import edu.unah.kolvix.dtos.marketplace.ReviewRequest;
import edu.unah.kolvix.dtos.marketplace.ReviewResponse;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final PerfilMarketplaceRepository perfilMarketplaceRepository;

    @Transactional
    public ReviewResponse crear(ReviewRequest request) {
        OrdenTrabajo orden = ordenTrabajoRepository.findById(request.ordenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada"));

        if (!orden.getCliente().getIdCliente().equals(request.clienteId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El cliente no coincide con el dueño de esta orden");
        }

        if (orden.getFechaEntrega() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Solo se puede reseñar una orden que ya fue entregada");
        }

        if (reviewRepository.existsByOrdenIdOrden(orden.getIdOrden())) {
            throw new IllegalArgumentException("Esta orden ya tiene una reseña registrada");
        }

        Review review = new Review();
        review.setOrden(orden);
        review.setEmpresa(orden.getEmpresa());
        review.setCliente(orden.getCliente());
        review.setCalificacion(request.calificacion());
        review.setComentario(request.comentario());

        review = reviewRepository.save(review);

        actualizarPromedioPerfil(orden.getEmpresa());

        return mapearResponse(review);
    }

    public List<ReviewResponse> listarPorTaller(Long empresaId) {
        return reviewRepository.findByEmpresaIdEmpresaOrderByFechaReviewDesc(empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    private void actualizarPromedioPerfil(Empresa empresa) {
        List<Review> reviews = reviewRepository.findByEmpresaIdEmpresaOrderByFechaReviewDesc(empresa.getIdEmpresa());

        int total = reviews.size();
        double promedio = reviews.stream()
                .mapToInt(Review::getCalificacion)
                .average()
                .orElse(0.0);

        BigDecimal promedioRedondeado = BigDecimal.valueOf(promedio).setScale(2, RoundingMode.HALF_UP);

        PerfilMarketplace perfil = perfilMarketplaceRepository.findByEmpresaIdEmpresa(empresa.getIdEmpresa())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El taller aún no tiene un perfil de marketplace configurado"));

        perfil.setCalificacionPromedio(promedioRedondeado);
        perfil.setTotalReviews(total);
        perfilMarketplaceRepository.save(perfil);
    }

    private ReviewResponse mapearResponse(Review review) {
        return new ReviewResponse(
                review.getIdReview(),
                review.getOrden().getIdOrden(),
                review.getEmpresa().getIdEmpresa(),
                review.getEmpresa().getNombre(),
                review.getCliente().getIdCliente(),
                review.getCliente().getNombre() + " " + review.getCliente().getApellido(),
                review.getCalificacion(),
                review.getComentario(),
                review.getFechaReview() != null ? review.getFechaReview().toInstant() : null
        );
    }
}