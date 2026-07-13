package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Page<Cliente> findByEmpresaIdEmpresaOrderByFechaRegistroDesc(Long empresaId, Pageable pageable);

    Optional<Cliente> findByIdClienteAndEmpresaIdEmpresa(Long idCliente, Long empresaId);

    boolean existsByEmpresaIdEmpresaAndDni(Long empresaId, String dni);
}
