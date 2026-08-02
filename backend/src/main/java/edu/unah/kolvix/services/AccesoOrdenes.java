package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.orden.OrdenTrabajoResponse;
import edu.unah.kolvix.entities.Tecnico;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.TecnicoRepository;
import lombok.RequiredArgsConstructor;

/**
 * Reglas de acceso a las órdenes de trabajo.
 *
 * Cubre dos cosas que antes no se validaban:
 *
 * 1. Aislamiento entre empresas: el empresaId venía en la URL y se usaba tal
 * cual, así que un usuario podía leer o modificar órdenes de otra empresa
 * cambiando el número del path.
 *
 * 2. Alcance del técnico: solo puede ver y trabajar las órdenes que tiene
 * asignadas, no todas las de su taller.
 */
@Component
@RequiredArgsConstructor
public class AccesoOrdenes {

    private final AccesoEmpresa accesoEmpresa;
    private final TecnicoRepository tecnicoRepository;

    public Usuario validarEmpresa(Long empresaId) {
        return accesoEmpresa.validarEmpresa(empresaId);
    }

    /** Id de técnico del usuario en sesión, o null si no tiene ese rol. */
    public Long idTecnicoDe(Usuario usuario) {
        if (usuario.getRol() != RolUsuario.TECNICO) {
            return null;
        }

        return tecnicoRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                .map(Tecnico::getIdTecnico)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Su usuario tiene rol TECNICO pero no tiene una ficha de técnico asociada"));
    }

    /** Rechaza la orden si el usuario es técnico y no es suya. */
    public void validarOrdenPropia(Usuario usuario, OrdenTrabajoResponse orden) {
        Long idTecnico = idTecnicoDe(usuario);
        if (idTecnico == null) {
            return;
        }

        if (!idTecnico.equals(orden.idTecnico())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada");
        }
    }

    public List<OrdenTrabajoResponse> filtrarPropias(Usuario usuario, List<OrdenTrabajoResponse> ordenes) {
        Long idTecnico = idTecnicoDe(usuario);
        if (idTecnico == null) {
            return ordenes;
        }

        return ordenes.stream()
                .filter(orden -> idTecnico.equals(orden.idTecnico()))
                .toList();
    }

    public Long resolverTecnicoConsultable(Usuario usuario, Long tecnicoIdSolicitado) {
        Long idTecnico = idTecnicoDe(usuario);
        return idTecnico == null ? tecnicoIdSolicitado : idTecnico;
    }
}
