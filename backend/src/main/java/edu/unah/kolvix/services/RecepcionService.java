package edu.unah.kolvix.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.orden.ActualizarDanosFisicosRequest;
import edu.unah.kolvix.dtos.orden.ActualizarDetallesRequest;
import edu.unah.kolvix.dtos.orden.ChecklistRecepcionRequest;
import edu.unah.kolvix.dtos.orden.ChecklistRecepcionResponse;
import edu.unah.kolvix.entities.ChecklistRecepcion;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.PlantillaInspeccion;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.ChecklistRecepcionRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecepcionService {

    private static final Set<RolUsuario> ROLES_RECEPCION =
            EnumSet.of(RolUsuario.ADMIN, RolUsuario.PROPIETARIO, RolUsuario.RECEPCIONISTA);

    private final ChecklistRecepcionRepository checklistRecepcionRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final PlantillaInspeccionService plantillaInspeccionService;
    private final AuthService authService;

    @Transactional
    public ChecklistRecepcionResponse registrarRecepcion(ChecklistRecepcionRequest request) {
        Usuario usuario = usuarioQuePuedeRecepcionar();

        OrdenTrabajo orden = ordenTrabajoRepository
                .findByIdOrdenAndEmpresaIdEmpresa(request.ordenId(), usuario.getEmpresa().getIdEmpresa())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada"));

        if (checklistRecepcionRepository.existsByOrden_IdOrden(request.ordenId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La orden ya tiene un checklist de recepción registrado");
        }

        ChecklistRecepcion checklist = new ChecklistRecepcion();
        checklist.setUsuario(usuario);
        checklist.setOrden(orden);
        checklist.setPlantillaInspeccion(resolverPlantilla(request.plantillaInspeccionId(), orden));
        checklist.setEstadoFisicoGeneral(request.estadoFisicoGeneral());
        checklist.setDanosFisicos(request.danosFisicos() != null ? request.danosFisicos() : new ArrayList<>());
        checklist.setObservaciones(normalizarTexto(request.observaciones()));
        checklist.setAceptacionCliente(request.aceptacionCliente());
        checklist.setUrlDocumentoAceptacion(normalizarTexto(request.urlDocumentoAceptacion()));

        if (request.aceptacionCliente() && request.fechaAceptacion() == null) {
            checklist.setFechaAceptacion(Instant.now());
        } else {
            checklist.setFechaAceptacion(request.fechaAceptacion());
        }

        return mapearResponse(checklistRecepcionRepository.save(checklist));
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarDanosFisicos(Long idChecklist, ActualizarDanosFisicosRequest request) {
        usuarioQuePuedeRecepcionar();

        ChecklistRecepcion checklist = buscarChecklist(idChecklist);
        checklist.setDanosFisicos(request.danosFisicos());

        return mapearResponse(checklistRecepcionRepository.save(checklist));
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarObservaciones(Long idChecklist, String observaciones) {
        usuarioQuePuedeRecepcionar();

        ChecklistRecepcion checklist = buscarChecklist(idChecklist);
        checklist.setObservaciones(normalizarTexto(observaciones));

        return mapearResponse(checklistRecepcionRepository.save(checklist));
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarPlantillaInspeccion(Long idChecklist, Long plantillaInspeccionId) {
        usuarioQuePuedeRecepcionar();

        ChecklistRecepcion checklist = buscarChecklist(idChecklist);
        checklist.setPlantillaInspeccion(resolverPlantilla(plantillaInspeccionId, checklist.getOrden()));

        return mapearResponse(checklistRecepcionRepository.save(checklist));
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarDetallesChecklist(Long idChecklist, ActualizarDetallesRequest request) {
        usuarioQuePuedeRecepcionar();

        ChecklistRecepcion checklist = buscarChecklist(idChecklist);

        if (request.estadoFisicoGeneral() != null) {
            checklist.setEstadoFisicoGeneral(request.estadoFisicoGeneral());
        }
        if (request.aceptacionCliente() != null) {
            checklist.setAceptacionCliente(request.aceptacionCliente());
            if (request.aceptacionCliente() && checklist.getFechaAceptacion() == null) {
                checklist.setFechaAceptacion(Instant.now());
            }
        }
        if (request.urlDocumentoAceptacion() != null) {
            checklist.setUrlDocumentoAceptacion(normalizarTexto(request.urlDocumentoAceptacion()));
        }
        if (request.fechaAceptacion() != null) {
            checklist.setFechaAceptacion(request.fechaAceptacion());
        }

        return mapearResponse(checklistRecepcionRepository.save(checklist));
    }

    @Transactional(readOnly = true)
    public ChecklistRecepcionResponse obtenerChecklistPorOrden(Long idOrden, Long empresaId) {
        ChecklistRecepcion checklist = checklistRecepcionRepository
                .findByOrdenIdOrdenAndOrdenEmpresaIdEmpresa(idOrden, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "La orden todavía no tiene checklist de recepción"));

        return mapearResponse(checklist);
    }

    @Transactional(readOnly = true)
    public ChecklistRecepcionResponse obtenerChecklist(Long idChecklist) {
        return mapearResponse(buscarChecklist(idChecklist));
    }

    private Usuario usuarioQuePuedeRecepcionar() {
        Usuario usuario = authService.getUsuarioAutenticado();

        if (!ROLES_RECEPCION.contains(usuario.getRol())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Su rol no permite registrar o modificar la recepción del equipo");
        }

        return usuario;
    }

    private ChecklistRecepcion buscarChecklist(Long idChecklist) {
        return checklistRecepcionRepository.findById(idChecklist)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El checklist de recepción no existe"));
    }

    // Evita marcar el chasis de una laptop sobre un celular.
    private PlantillaInspeccion resolverPlantilla(Long plantillaInspeccionId, OrdenTrabajo orden) {
        if (plantillaInspeccionId == null) {
            return null;
        }

        PlantillaInspeccion plantilla = plantillaInspeccionService.buscarActiva(plantillaInspeccionId);
        Integer categoriaDispositivo = orden.getDispositivo().getCategoria().getIdCategoria();

        if (!plantilla.getCategoria().getIdCategoria().equals(categoriaDispositivo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La plantilla no corresponde a la categoría del dispositivo de la orden");
        }

        return plantilla;
    }

    private ChecklistRecepcionResponse mapearResponse(ChecklistRecepcion checklist) {
        PlantillaInspeccion plantilla = checklist.getPlantillaInspeccion();

        return new ChecklistRecepcionResponse(
                checklist.getIdChecklist(),
                checklist.getOrden() != null ? checklist.getOrden().getIdOrden() : null,
                checklist.getUsuario() != null ? checklist.getUsuario().getIdUsuario() : null,
                nombreCompleto(checklist.getUsuario()),
                plantilla != null ? plantilla.getIdPlantilla() : null,
                plantilla != null ? plantilla.getNombre() : null,
                checklist.getEstadoFisicoGeneral(),
                checklist.getDanosFisicos(),
                checklist.getObservaciones(),
                checklist.isAceptacionCliente(),
                checklist.getUrlDocumentoAceptacion(),
                checklist.getFechaAceptacion(),
                checklist.getFecha()
        );
    }

    private String nombreCompleto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        String nombre = usuario.getNombre();
        String apellido = usuario.getApellido();
        if (nombre == null && apellido == null) {
            return null;
        }
        return ((nombre != null ? nombre : "") + " " + (apellido != null ? apellido : "")).trim();
    }

    private String normalizarTexto(String valor) {
        if (valor == null) {
            return null;
        }
        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }
}
