package edu.unah.kolvix.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Page<Cliente> findByEmpresaIdEmpresaOrderByFechaRegistroDesc(Long empresaId, Pageable pageable);

    List<Cliente> findByEmpresaIdEmpresaOrderByFechaRegistroDesc(Long empresaId);

    Optional<Cliente> findByIdClienteAndEmpresaIdEmpresa(Long idCliente, Long empresaId);

    Optional<Cliente> findByEmpresaIdEmpresaAndDni(Long empresaId, String dni);

    boolean existsByEmpresaIdEmpresaAndDni(Long empresaId, String dni);
}
