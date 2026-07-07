package edu.unah.kolvix.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Page<Usuario> findByEmpresaIdEmpresaOrderByNombreAscApellidoAsc(Long empresaId, Pageable pageable);

    Optional<Usuario> findByIdUsuarioAndEmpresaIdEmpresa(Long idUsuario, Long empresaId);

    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    Page<Usuario> findByEmpresaIdEmpresaAndRolOrderByNombreAscApellidoAsc(
            Long empresaId,
            RolUsuario rol,
            Pageable pageable
    );

    boolean existsByCorreoIgnoreCase(String correo);

}
