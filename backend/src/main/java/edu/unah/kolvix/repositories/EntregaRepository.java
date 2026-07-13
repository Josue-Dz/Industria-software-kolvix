package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Entrega;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {

    @EntityGraph(attributePaths = {"orden", "usuarioEntrega"})
    Optional<Entrega> findByOrdenIdOrdenAndOrdenEmpresaIdEmpresa(Long ordenId, Long empresaId);

    Optional<Entrega> findByIdEntregaAndOrdenEmpresaIdEmpresa(Long idEntrega, Long empresaId);
}
