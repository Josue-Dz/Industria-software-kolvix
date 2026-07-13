package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEmpresaIdEmpresaOrderByFechaReviewDesc(Long empresaId);

    Optional<Review> findByOrdenIdOrdenAndEmpresaIdEmpresa(Long ordenId, Long empresaId);
}
