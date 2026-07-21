package edu.unah.kolvix.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.usuario.TecnicoRequest;
import edu.unah.kolvix.dtos.usuario.TecnicoResponse;
import edu.unah.kolvix.dtos.usuario.TecnicoUpdateRequest;
import edu.unah.kolvix.entities.Empresa;
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
    public TecnicoResponse crear(TecnicoRequest request, Empresa empresa) {

        Usuario usuario = usuarioRepository.findByIdUsuarioAndEmpresaIdEmpresa(request.idUsuario(), empresa.getIdEmpresa())
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe en esta empresa"));

        if (usuario.getRol() != RolUsuario.TECNICO) {
            throw new IllegalArgumentException("El usuario debe tener rol TECNICO para poder asociarse");
        }

        if (tecnicoRepository.existsByUsuarioIdUsuario(usuario.getIdUsuario())) {
            throw new IllegalArgumentException("Este usuario ya está asociado a un técnico existente");
        }

        if (tecnicoRepository.existsByEmpresaIdEmpresaAndDni(empresa.getIdEmpresa(), request.dni())) {
            throw new IllegalArgumentException("Ya existe un técnico con ese DNI en la empresa");
        }

        Tecnico tecnico = new Tecnico();
        tecnico.setEmpresa(empresa);
        tecnico.setUsuario(usuario);
        tecnico.setDni(request.dni());
        tecnico.setRtn(request.rtn());
        tecnico.setDireccion(request.direccion());
        tecnico.setTelefono(request.telefono());
        tecnico.setFechaNacimiento(request.fechaNacimiento());
        tecnico.setNombreContactoEmergencia(request.nombreContactoEmergencia());
        tecnico.setTelefonoContactoEmergencia(request.telefonoContactoEmergencia());
        tecnico.setUrlFotografia(request.urlFotografia());
        tecnico.setActivo(true);

        tecnico = tecnicoRepository.save(tecnico);
        return mapearResponse(tecnico);
    }

    public Page<TecnicoResponse> listar(Long empresaId, Pageable pageable) {
        return tecnicoRepository.findByEmpresaIdEmpresaOrderByIdTecnicoDesc(empresaId, pageable)
                .map(this::mapearResponse);
    }

    public TecnicoResponse obtener(Long idTecnico, Long empresaId) {
        return mapearResponse(buscarTecnico(idTecnico, empresaId));
    }

    @Transactional
    public TecnicoResponse editar(Long idTecnico, Long empresaId, TecnicoUpdateRequest request) {
        Tecnico tecnico = buscarTecnico(idTecnico, empresaId);

        if (request.dni() != null && !request.dni().isBlank() && !request.dni().equals(tecnico.getDni())) {
            if (tecnicoRepository.existsByEmpresaIdEmpresaAndDni(empresaId, request.dni())) {
                throw new IllegalArgumentException("Ya existe un técnico con ese DNI en la empresa");
            }
            tecnico.setDni(request.dni());
        }

        tecnico.setRtn(request.rtn());
        tecnico.setDireccion(request.direccion());
        tecnico.setTelefono(request.telefono());
        tecnico.setFechaNacimiento(request.fechaNacimiento());
        tecnico.setNombreContactoEmergencia(request.nombreContactoEmergencia());
        tecnico.setTelefonoContactoEmergencia(request.telefonoContactoEmergencia());
        tecnico.setUrlFotografia(request.urlFotografia());

        tecnico = tecnicoRepository.save(tecnico);
        return mapearResponse(tecnico);
    }

    @Transactional
    public TecnicoResponse cambiarEstado(Long idTecnico, Long empresaId, boolean activo) {
        Tecnico tecnico = buscarTecnico(idTecnico, empresaId);
        tecnico.setActivo(activo);
        tecnico = tecnicoRepository.save(tecnico);
        return mapearResponse(tecnico);
    }

    private Tecnico buscarTecnico(Long idTecnico, Long empresaId) {
        return tecnicoRepository.findByIdTecnicoAndEmpresaIdEmpresa(idTecnico, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Técnico no encontrado"));
    }

    private TecnicoResponse mapearResponse(Tecnico tecnico) {
        Usuario usuario = tecnico.getUsuario();
        return new TecnicoResponse(
                tecnico.getIdTecnico(),
                tecnico.getEmpresa().getIdEmpresa(),
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCorreo(),
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
}
