package edu.unah.kolvix.services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.usuario.TecnicoRequest;
import edu.unah.kolvix.dtos.usuario.TecnicoResponse;
import edu.unah.kolvix.entities.Tecnico;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.TecnicoRepository;
import edu.unah.kolvix.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TecnicoService {

    private final TecnicoRepository tecnicoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public TecnicoResponse completarDatosTecnico(Long idTecnico, TecnicoRequest request, Usuario usuarioAutenticado) {
        Tecnico tecnico = tecnicoRepository.findById(idTecnico)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El técnico no existe"));

        if (!puedeGestionarTecnico(usuarioAutenticado, tecnico)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permisos para modificar este técnico");
        }

        if (request.dni() != null && !request.dni().isBlank()) {
            Optional<Tecnico> existente = tecnicoRepository.findAll().stream()
                    .filter(item -> item.getDni() != null && item.getDni().equalsIgnoreCase(request.dni().trim()))
                    .findFirst();
            if (existente.isPresent() && !existente.get().getIdTecnico().equals(idTecnico)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un técnico con ese DNI");
            }
        }

        tecnico.setDni(normalizarTexto(request.dni()));
        tecnico.setRtn(normalizarTexto(request.rtn()));
        tecnico.setDireccion(normalizarTexto(request.direccion()));
        tecnico.setTelefono(normalizarTexto(request.telefono()));
        tecnico.setFechaNacimiento(request.fechaNacimiento());
        tecnico.setNombreContactoEmergencia(normalizarTexto(request.nombreContactoEmergencia()));
        tecnico.setTelefonoContactoEmergencia(normalizarTexto(request.telefonoContactoEmergencia()));
        tecnico.setUrlFotografia(normalizarTexto(request.urlFotografia()));
        tecnico.setActivo(request.activo());

        Tecnico guardado = tecnicoRepository.save(tecnico);
        return mapearResponse(guardado);
    }

    private boolean puedeGestionarTecnico(Usuario usuarioAutenticado, Tecnico tecnico) {
        if (usuarioAutenticado == null) {
            return false;
        }

        if (usuarioAutenticado.getRol() == RolUsuario.ADMIN) {
            return true;
        }

        return tecnico.getUsuario() != null
                && tecnico.getUsuario().getIdUsuario().equals(usuarioAutenticado.getIdUsuario());
    }

    private TecnicoResponse mapearResponse(Tecnico tecnico) {
        return new TecnicoResponse(
                tecnico.getIdTecnico(),
                tecnico.getEmpresa() != null ? tecnico.getEmpresa().getIdEmpresa() : null,
                tecnico.getUsuario() != null ? tecnico.getUsuario().getIdUsuario() : null,
                tecnico.getUsuario() != null ? tecnico.getUsuario().getNombre() : null,
                tecnico.getUsuario() != null ? tecnico.getUsuario().getApellido() : null,
                tecnico.getUsuario() != null ? tecnico.getUsuario().getCorreo() : null,
                tecnico.getDni(),
                tecnico.getRtn(),
                tecnico.getDireccion(),
                tecnico.getTelefono(),
                tecnico.getFechaNacimiento(),
                tecnico.getNombreContactoEmergencia(),
                tecnico.getTelefonoContactoEmergencia(),
                tecnico.getUrlFotografia(),
                tecnico.isActivo()
        );
    }

    private String normalizarTexto(String valor) {
        if (valor == null) {
            return null;
        }
        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }
}
