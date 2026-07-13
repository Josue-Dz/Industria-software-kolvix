package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Dispositivo;

public interface DispositivoRepository extends JpaRepository<Dispositivo, Long> {

    @EntityGraph(attributePaths = {"cliente", "categoria"})
    List<Dispositivo> findByEmpresaIdEmpresaAndClienteIdClienteOrderByIdDispositivoDesc(
            Long empresaId,
            Long clienteId
    );

    Optional<Dispositivo> findByIdDispositivoAndEmpresaIdEmpresa(Long idDispositivo, Long empresaId);
}
