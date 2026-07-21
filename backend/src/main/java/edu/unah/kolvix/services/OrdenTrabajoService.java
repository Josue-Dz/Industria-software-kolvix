package edu.unah.kolvix.services;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.orden.CambioEstadoPagoRequest;
import edu.unah.kolvix.dtos.orden.AsignarTecnicoRequest;
import edu.unah.kolvix.dtos.orden.EstadoReparacionRequest;
import edu.unah.kolvix.dtos.orden.HistorialOrdenResponse;
import edu.unah.kolvix.dtos.orden.OrdenTrabajoRequest;
import edu.unah.kolvix.dtos.orden.OrdenTrabajoResponse;
import edu.unah.kolvix.entities.Cliente;
import edu.unah.kolvix.entities.Dispositivo;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.EstadoReparacion;
import edu.unah.kolvix.entities.HistorialOrden;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.Tecnico;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.EstadoPagoOrden;
import edu.unah.kolvix.enums.RolUsuario;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.DispositivoRepository;
import edu.unah.kolvix.repositories.EmpresaRepository;
import edu.unah.kolvix.repositories.EstadoReparacionRepository;
import edu.unah.kolvix.repositories.HistorialOrdenRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import edu.unah.kolvix.repositories.TecnicoRepository;
import edu.unah.kolvix.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrdenTrabajoService {

    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final EmpresaRepository empresaRepository;
    private final ClienteRepository clienteRepository;
    private final DispositivoRepository dispositivoRepository;
    private final TecnicoRepository tecnicoRepository;
    private final EstadoReparacionRepository estadoReparacionRepository;
    private final HistorialOrdenRepository historialOrdenRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public OrdenTrabajoResponse crearOrdenTrabajo(Long empresaId, OrdenTrabajoRequest request) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La empresa no existe"));

        Cliente cliente = clienteRepository.findById(request.idCliente())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El cliente no existe"));

        if (!empresaId.equals(cliente.getEmpresa() != null ? cliente.getEmpresa().getIdEmpresa() : null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El cliente no pertenece a la empresa indicada");
        }

        Dispositivo dispositivo = dispositivoRepository.findById(request.idDispositivo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El dispositivo no existe"));

        if (!empresaId.equals(dispositivo.getEmpresa() != null ? dispositivo.getEmpresa().getIdEmpresa() : null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El dispositivo no pertenece a la empresa indicada");
        }

        if (!cliente.getIdCliente().equals(dispositivo.getCliente() != null ? dispositivo.getCliente().getIdCliente() : null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El dispositivo no pertenece al cliente indicado");
        }

        Tecnico tecnico = null;
        if (request.idTecnico() != null) {
            tecnico = tecnicoRepository.findByIdTecnicoAndEmpresaIdEmpresa(request.idTecnico(), empresaId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El técnico no existe en la empresa"));
            if (tecnico.getUsuario() == null || tecnico.getUsuario().getRol() != RolUsuario.TECNICO) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario asignado no tiene el rol de técnico");
            }
        }

        EstadoReparacion estadoInicial = estadoReparacionRepository.findByEmpresaIdEmpresaOrderByOrdenAsc(empresaId)
                .stream()
                .findFirst()
                .orElseGet(() -> crearEstadoInicial(empresa));

        OrdenTrabajo orden = new OrdenTrabajo();
        orden.setEmpresa(empresa);
        orden.setCliente(cliente);
        orden.setDispositivo(dispositivo);
        orden.setTecnico(tecnico);
        orden.setEstado(estadoInicial);
        orden.setNumeroOrden(generarNumeroOrden(empresaId));
        orden.setCodigoSeguimiento(generarCodigoSeguimiento());
        orden.setProblemaReportado(normalizarTexto(request.problemaReportado()));
        orden.setObservaciones(normalizarTexto(request.observaciones()));
        orden.setFechaIngreso(Instant.now());
        orden.setUpdatedAt(Instant.now());
        orden.setEstadoPago(EstadoPagoOrden.NO_SOLICITADO);

        return mapearResponse(ordenTrabajoRepository.save(orden));
    }

    @Transactional(readOnly = true)
    public List<OrdenTrabajoResponse> listarPorEmpresaYEstadoPago(Long empresaId, EstadoPagoOrden estadoPago) {
        validarEmpresa(empresaId);
        return ordenTrabajoRepository.findByEmpresaIdEmpresaAndEstadoPagoOrderByFechaIngresoDesc(empresaId, estadoPago)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrdenTrabajoResponse> listarPorEmpresaYTecnico(Long empresaId, Long tecnicoId) {
        validarEmpresa(empresaId);
        tecnicoRepository.findByIdTecnicoAndEmpresaIdEmpresa(tecnicoId, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El técnico no existe en la empresa"));
        return ordenTrabajoRepository.findByEmpresaIdEmpresaAndTecnicoIdTecnicoOrderByFechaIngresoDesc(empresaId, tecnicoId, Pageable.unpaged())
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrdenTrabajoResponse obtenerPorId(Long empresaId, Long idOrden) {
        validarEmpresa(empresaId);
        OrdenTrabajo orden = ordenTrabajoRepository.findByIdOrdenAndEmpresaIdEmpresa(idOrden, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no existe en la empresa"));
        return mapearResponse(orden);
    }

    @Transactional(readOnly = true)
    public OrdenTrabajoResponse obtenerPorNumero(Long empresaId, String numeroOrden) {
        validarEmpresa(empresaId);
        OrdenTrabajo orden = ordenTrabajoRepository.findByEmpresaIdEmpresaAndNumeroOrden(empresaId, numeroOrden)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no existe en la empresa"));
        return mapearResponse(orden);
    }

    @Transactional
    public OrdenTrabajoResponse cambiarEstadoPago(Long empresaId, Long idOrden, CambioEstadoPagoRequest request) {
        OrdenTrabajo orden = obtenerOrdenEmpresa(empresaId, idOrden);
        orden.setEstadoPago(request.estadoPago());
        orden.setUpdatedAt(Instant.now());
        return mapearResponse(ordenTrabajoRepository.save(orden));
    }
// Estado de Reparacion y Historial de Ordenes
    @Transactional
    public OrdenTrabajoResponse cambiarEstadoReparacion(Long empresaId, Long idOrden, EstadoReparacionRequest request) {
        OrdenTrabajo orden = obtenerOrdenEmpresa(empresaId, idOrden);
        EstadoReparacion estado = orden.getEstado();
        if (estado == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La orden no tiene un estado de reparación asignado");
        }

        EstadoReparacion estadoAnterior = estado;
        estado.setNombre(normalizarTexto(request.nombre()));
        estado.setColorHex(normalizarTexto(request.colorHex()));
        estado.setOrden(request.orden());
        estado.setEsEstadoFinal(request.estadoFinal());
        estado.setNotificarCliente(request.notificarCliente());
        orden.setUpdatedAt(Instant.now());
        estadoReparacionRepository.save(estado);
        ordenTrabajoRepository.save(orden);

        Usuario usuario = usuarioRepository.findById(1L)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo registrar el historial"));
        HistorialOrden historial = new HistorialOrden();
        historial.setOrden(orden);
        historial.setUsuario(usuario);
        historial.setEstadoNuevo(estado);
        historial.setEstadoAnterior(estadoAnterior);
        historial.setComentario(null);
        historialOrdenRepository.save(historial);

        return mapearResponse(orden);
    }

    @Transactional
    public OrdenTrabajoResponse cambiarTecnico(Long empresaId, Long idOrden, AsignarTecnicoRequest request) {
        OrdenTrabajo orden = obtenerOrdenEmpresa(empresaId, idOrden);
        Tecnico tecnico = tecnicoRepository.findByIdTecnicoAndEmpresaIdEmpresa(request.idTecnico(), empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El técnico no existe en la empresa"));
        if (tecnico.getUsuario() == null || tecnico.getUsuario().getRol() != RolUsuario.TECNICO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario asignado no tiene el rol de técnico");
        }
        orden.setTecnico(tecnico);
        orden.setUpdatedAt(Instant.now());
        return mapearResponse(ordenTrabajoRepository.save(orden));
    }

    @Transactional(readOnly = true)
    public HistorialOrdenResponse obtenerUltimoEvento(Long empresaId, Long idOrden) {
        OrdenTrabajo orden = obtenerOrdenEmpresa(empresaId, idOrden);
        return historialOrdenRepository.findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByFechaAsc(orden.getIdOrden(), empresaId)
                .stream()
                .reduce((first, second) -> second)
                .map(this::mapearHistorialResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no tiene historial"));
    }

    @Transactional(readOnly = true)
    public List<HistorialOrdenResponse> obtenerHistorialOrden(Long empresaId, Long idOrden) {
        OrdenTrabajo orden = obtenerOrdenEmpresa(empresaId, idOrden);
        return historialOrdenRepository.findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByFechaAsc(orden.getIdOrden(), empresaId)
                .stream()
                .map(this::mapearHistorialResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HistorialOrdenResponse obtenerUltimoEventoPorNumero(Long empresaId, String numeroOrden) {
        OrdenTrabajo orden = ordenTrabajoRepository.findByEmpresaIdEmpresaAndNumeroOrden(empresaId, numeroOrden)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no existe en la empresa"));
        return obtenerUltimoEvento(empresaId, orden.getIdOrden());
    }

    @Transactional(readOnly = true)
    public List<HistorialOrdenResponse> obtenerHistorialPorNumero(Long empresaId, String numeroOrden) {
        OrdenTrabajo orden = ordenTrabajoRepository.findByEmpresaIdEmpresaAndNumeroOrden(empresaId, numeroOrden)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no existe en la empresa"));
        return obtenerHistorialOrden(empresaId, orden.getIdOrden());
    }

    private OrdenTrabajo obtenerOrdenEmpresa(Long empresaId, Long idOrden) {
        return ordenTrabajoRepository.findByIdOrdenAndEmpresaIdEmpresa(idOrden, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no existe en la empresa"));
    }

    private void validarEmpresa(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La empresa no existe");
        }
    }

    private EstadoReparacion crearEstadoInicial(Empresa empresa) {
        EstadoReparacion estado = new EstadoReparacion();
        estado.setEmpresa(empresa);
        estado.setNombre("Recibido");
        estado.setColorHex("#3B82F6");
        estado.setOrden((short) 1);
        estado.setEsEstadoFinal(false);
        estado.setNotificarCliente(false);
        return estadoReparacionRepository.save(estado);
    }

    private String generarNumeroOrden(Long empresaId) {
        for (int intento = 0; intento < 10; intento++) {
            String numero = String.format("%08d", ThreadLocalRandom.current().nextInt(10000000, 100000000));
            if (!ordenTrabajoRepository.existsByEmpresaIdEmpresaAndNumeroOrden(empresaId, numero)) {
                return numero;
            }
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "No se pudo generar un número de orden único");
    }

    private String generarCodigoSeguimiento() {
        for (int intento = 0; intento < 10; intento++) {
            String codigo = "OT" + String.format("%06d", ThreadLocalRandom.current().nextInt(100000, 1000000));
            if (!ordenTrabajoRepository.existsByCodigoSeguimiento(codigo)) {
                return codigo;
            }
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "No se pudo generar un código de seguimiento único");
    }

    private OrdenTrabajoResponse mapearResponse(OrdenTrabajo orden) {
        return new OrdenTrabajoResponse(
                orden.getIdOrden(),
                orden.getEmpresa() != null ? orden.getEmpresa().getIdEmpresa() : null,
                orden.getCliente() != null ? orden.getCliente().getIdCliente() : null,
                orden.getDispositivo() != null ? orden.getDispositivo().getIdDispositivo() : null,
                orden.getTecnico() != null ? orden.getTecnico().getIdTecnico() : null,
                orden.getEstado() != null ? orden.getEstado().getIdEstado() : null,
                orden.getCliente() != null ? nombreCompleto(orden.getCliente()) : null,
                orden.getDispositivo() != null ? resumenDispositivo(orden.getDispositivo()) : null,
                orden.getTecnico() != null && orden.getTecnico().getUsuario() != null ? nombreCompleto(orden.getTecnico().getUsuario()) : null,
                orden.getEstado() != null ? orden.getEstado().getNombre() : null,
                orden.getEstado() != null ? orden.getEstado().getColorHex() : null,
                orden.getNumeroOrden(),
                orden.getCodigoSeguimiento(),
                orden.getProblemaReportado(),
                orden.getFechaIngreso(),
                orden.getFechaEntrega(),
                orden.getFechaCierre(),
                orden.getObservaciones(),
                orden.getEstadoPago()
        );
    }

    private String nombreCompleto(Cliente cliente) {
        if (cliente == null) {
            return null;
        }
        String nombre = cliente.getNombre();
        String apellido = cliente.getApellido();
        if (nombre == null && apellido == null) {
            return null;
        }
        return ((nombre != null ? nombre : "") + " " + (apellido != null ? apellido : "")).trim();
    }

    private String nombreCompleto(edu.unah.kolvix.entities.Usuario usuario) {
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

    private String resumenDispositivo(Dispositivo dispositivo) {
        if (dispositivo == null) {
            return null;
        }
        String marca = dispositivo.getMarca();
        String modelo = dispositivo.getModelo();
        if (marca == null && modelo == null) {
            return null;
        }
        return ((marca != null ? marca : "") + " " + (modelo != null ? modelo : "")).trim();
    }

    private String normalizarTexto(String valor) {
        if (valor == null) {
            return null;
        }
        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }

    private HistorialOrdenResponse mapearHistorialResponse(HistorialOrden historial) {
        return new HistorialOrdenResponse(
                historial.getIdHistorial(),
                historial.getOrden() != null ? historial.getOrden().getIdOrden() : null,
                historial.getUsuario() != null ? historial.getUsuario().getIdUsuario() : null,
                historial.getUsuario() != null ? nombreCompleto(historial.getUsuario()) : null,
                historial.getEstadoAnterior() != null ? historial.getEstadoAnterior().getIdEstado() : null,
                historial.getEstadoAnterior() != null ? historial.getEstadoAnterior().getNombre() : null,
                historial.getEstadoNuevo() != null ? historial.getEstadoNuevo().getIdEstado() : null,
                historial.getEstadoNuevo() != null ? historial.getEstadoNuevo().getNombre() : null,
                historial.getComentario(),
                historial.getFecha()
        );
    }
}
