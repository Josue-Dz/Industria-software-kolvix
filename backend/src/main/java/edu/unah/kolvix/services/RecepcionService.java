package edu.unah.kolvix.services;

import java.time.Instant;
import java.util.ArrayList;

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
import edu.unah.kolvix.enums.EstadoFisicoGeneral;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.ChecklistRecepcionRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import edu.unah.kolvix.repositories.PlantillaInspeccionRepository;
import edu.unah.kolvix.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecepcionService {

    private final ChecklistRecepcionRepository checklistRecepcionRepository;
    private final UsuarioRepository usuarioRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final PlantillaInspeccionRepository plantillaInspeccionRepository;

    @Transactional
    public ChecklistRecepcionResponse registrarRecepcion(ChecklistRecepcionRequest request) {
        
        // 1. Obtener y validar el Usuario
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (usuario.getRol() != RolUsuario.RECEPCIONISTA) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario asignado no tiene el rol de recepcionista");
        }

        // 2. Obtener y validar la Orden de Trabajo
        OrdenTrabajo orden = ordenTrabajoRepository.findById(request.ordenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden de trabajo no existe"));

        // Validar que la orden no tenga ya un checklist (por la relación OneToOne)
        if (checklistRecepcionRepository.existsByOrden_IdOrden(request.ordenId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La orden ya tiene un checklist de recepción registrado");
        }

        // 3. Obtener y validar la Plantilla de Inspección (si viene en el request)
        PlantillaInspeccion plantilla = null;
        if (request.plantillaInspeccionId() != null) {
            plantilla = plantillaInspeccionRepository.findById(request.plantillaInspeccionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La plantilla de inspección no existe"));
        }

        // 4. Crear la entidad y mapear los datos
        ChecklistRecepcion checklist = new ChecklistRecepcion();
        checklist.setUsuario(usuario);
        checklist.setOrden(orden);
        checklist.setPlantillaInspeccion(plantilla);
        checklist.setEstadoFisicoGeneral(request.estadoFisicoGeneral());
        
        // Prevenir nulos en la estructura JSONB para la base de datos
        checklist.setDanosFisicos(request.danosFisicos() != null ? request.danosFisicos() : new ArrayList<>());
        checklist.setObservaciones(normalizarTexto(request.observaciones()));
        checklist.setAceptacionCliente(request.aceptacionCliente());
        checklist.setUrlDocumentoAceptacion(request.urlDocumentoAceptacion());

        // Lógica de validación para la aceptación de cliente
        if (request.aceptacionCliente() && request.fechaAceptacion() == null) {
            checklist.setFechaAceptacion(Instant.now());
        } else {
            checklist.setFechaAceptacion(request.fechaAceptacion());
        }

        // 5. Persistir la entidad
        checklist = checklistRecepcionRepository.save(checklist);

        // 6. Construir y retornar el Response
        return mapearResponse(checklist);
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarDanosFisicos(Long idChecklist, ActualizarDanosFisicosRequest request) {
        
        // 1. Obtener y validar el Usuario
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (usuario.getRol() != RolUsuario.RECEPCIONISTA) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario asignado no tiene el rol de recepcionista");
        }

        // 2. Obtener el Checklist existente
        ChecklistRecepcion checklist = checklistRecepcionRepository.findById(idChecklist)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El checklist de recepción no existe"));

        // 3. Modificar únicamente la lista de daños físicos
        // Al estar mapeado como JSONB, Hibernate se encarga de serializar la lista de Maps.
        checklist.setDanosFisicos(request.danosFisicos());

        // 4. Persistir los cambios
        checklist = checklistRecepcionRepository.save(checklist);

        // 5. Retornar la respuesta mapeada
        return mapearResponse(checklist);
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarObservaciones(Long idChecklist, String observaciones) {
        
        // 1. Obtener el Checklist existente
        ChecklistRecepcion checklist = checklistRecepcionRepository.findById(idChecklist)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El checklist de recepción no existe"));

        // 2. Modificar únicamente las observaciones
        checklist.setObservaciones(normalizarTexto(observaciones));

        // 3. Persistir los cambios
        checklist = checklistRecepcionRepository.save(checklist);

        // 4. Retornar la respuesta mapeada
        return mapearResponse(checklist);
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarPlantillaInspeccion(Long idChecklist, Long plantillaInspeccionId) {
        
        // 1. Obtener el Checklist existente
        ChecklistRecepcion checklist = checklistRecepcionRepository.findById(idChecklist)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El checklist de recepción no existe"));

        // 2. Obtener y validar la Plantilla de Inspección
        PlantillaInspeccion plantilla = plantillaInspeccionRepository.findById(plantillaInspeccionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La plantilla de inspección no existe"));

        // 3. Modificar únicamente la plantilla de inspección
        checklist.setPlantillaInspeccion(plantilla);

        // 4. Persistir los cambios
        checklist = checklistRecepcionRepository.save(checklist);

        // 5. Retornar la respuesta mapeada
        return mapearResponse(checklist);
    }

    @Transactional(readOnly = true)
    public ChecklistRecepcionResponse obtenerChecklistPorOrden(Long idOrden, Long empresaId) {
        // 1. Obtener el Checklist existente por idOrden y validar que pertenece a la empresa
        ChecklistRecepcion checklist = checklistRecepcionRepository.findByOrdenIdOrdenAndOrdenEmpresaIdEmpresa(idOrden, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El checklist de recepción no existe para la orden y empresa especificadas"));

        // 2. Retornar la respuesta mapeada
        return mapearResponse(checklist);
    }

    @Transactional(readOnly = true)
    public ChecklistRecepcionResponse obtenerChecklist(Long idChecklist) {
        // 1. Obtener el Checklist existente por idChecklist
        ChecklistRecepcion checklist = checklistRecepcionRepository.findById(idChecklist)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El checklist de recepción no existe"));

        // 2. Retornar la respuesta mapeada
        return mapearResponse(checklist);
    }

    @Transactional
    public ChecklistRecepcionResponse actualizarDetallesChecklist(Long idChecklist, ActualizarDetallesRequest request) {
        // 1. Obtener el Checklist existente
        ChecklistRecepcion checklist = checklistRecepcionRepository.findById(idChecklist)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El checklist de recepción no existe"));

        // 2. Actualizar los detalles según los parámetros proporcionados
        if (request.estadoFisicoGeneral() != null) {
            checklist.setEstadoFisicoGeneral(request.estadoFisicoGeneral());
        }
        if (request.aceptacionCliente() != null) {
            checklist.setAceptacionCliente(request.aceptacionCliente());
        }
        if (request.urlDocumentoAceptacion() != null) {
            checklist.setUrlDocumentoAceptacion(normalizarTexto(request.urlDocumentoAceptacion()));
        }
        if (request.fechaAceptacion() != null) {
            try {
                Instant fecha = request.fechaAceptacion();
                checklist.setFechaAceptacion(fecha);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de fecha inválido para fechaAceptacion");
            }
        }

        // 3. Persistir los cambios
        checklist = checklistRecepcionRepository.save(checklist);

        // 4. Retornar la respuesta mapeada
        return mapearResponse(checklist);
    }

    // --- Métodos Auxiliares ---
// Este método extrae los datos directamente de la entidad para el Response
    private ChecklistRecepcionResponse mapearResponse(ChecklistRecepcion checklist) {
        return new ChecklistRecepcionResponse(
                checklist.getIdChecklist(),
                checklist.getOrden() != null ? checklist.getOrden().getIdOrden() : null,
                checklist.getUsuario() != null ? checklist.getUsuario().getIdUsuario() : null,
                nombreCompleto(checklist.getUsuario()),
                checklist.getPlantillaInspeccion() != null ? checklist.getPlantillaInspeccion().getIdPlantilla() : null,
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