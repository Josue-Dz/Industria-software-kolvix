package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static edu.unah.kolvix.enums.CodigoEstadoReparacion.CANCELADO;
import static edu.unah.kolvix.enums.CodigoEstadoReparacion.CONTROL_CALIDAD;
import static edu.unah.kolvix.enums.CodigoEstadoReparacion.COTIZACION;
import static edu.unah.kolvix.enums.CodigoEstadoReparacion.DIAGNOSTICO;
import static edu.unah.kolvix.enums.CodigoEstadoReparacion.ENTREGADO;
import static edu.unah.kolvix.enums.CodigoEstadoReparacion.EN_REPARACION;
import static edu.unah.kolvix.enums.CodigoEstadoReparacion.LISTO_ENTREGA;
import static edu.unah.kolvix.enums.CodigoEstadoReparacion.RECEPCION;

import edu.unah.kolvix.dtos.orden.EstadoReparacionRequest;
import edu.unah.kolvix.dtos.orden.EstadoReparacionResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.EstadoReparacion;
import edu.unah.kolvix.enums.CodigoEstadoReparacion;
import edu.unah.kolvix.repositories.EstadoReparacionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstadoReparacionService {
    
    private final EstadoReparacionRepository estadoReparacionRepository;

    public List<EstadoReparacionResponse> listar(Long empresaId) {
        return estadoReparacionRepository.findByEmpresaIdEmpresaOrderByOrdenAsc(empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional
    public EstadoReparacionResponse crear(EstadoReparacionRequest request, Empresa empresa) {
        validarNombreUnico(empresa.getIdEmpresa(), request.nombre(), null);

        EstadoReparacion estado = new EstadoReparacion();
        estado.setEmpresa(empresa);
        estado.setNombre(request.nombre());
        estado.setColorHex(request.colorHex());
        estado.setOrden(request.orden());
        estado.setEsEstadoFinal(request.estadoFinal());
        estado.setNotificarCliente(request.notificarCliente());

        estado = estadoReparacionRepository.save(estado);
        return mapearResponse(estado);
    }

    @Transactional
    public EstadoReparacionResponse editar(Integer idEstado, Long empresaId, EstadoReparacionRequest request) {
        EstadoReparacion estado = buscarEstado(idEstado, empresaId);

        validarNombreUnico(empresaId, request.nombre(), idEstado);

        estado.setNombre(request.nombre());
        estado.setColorHex(request.colorHex());
        estado.setOrden(request.orden());
        estado.setEsEstadoFinal(request.estadoFinal());
        estado.setNotificarCliente(request.notificarCliente());

        estado = estadoReparacionRepository.save(estado);
        return mapearResponse(estado);
    }

    @Transactional
    public EstadoReparacionResponse cambiarOrden(Integer idEstado, Long empresaId, Short nuevoOrden) {
        EstadoReparacion estado = buscarEstado(idEstado, empresaId);
        estado.setOrden(nuevoOrden);
        estado = estadoReparacionRepository.save(estado);
        return mapearResponse(estado);
    }

    @Transactional
    public void crearEstadosPorDefecto(Empresa empresa) {
        estadoReparacionRepository.saveAll(estadosPorDefecto(empresa));
    }

    // Idempotente: agrega solo las etapas del flujo estándar que la empresa no
    // tenga aún. Se compara por código, no por nombre, para no duplicar una etapa
    // que el taller haya renombrado.
    @Transactional
    public List<EstadoReparacionResponse> asegurarEstadosPorDefecto(Empresa empresa) {
        List<EstadoReparacion> faltantes = estadosPorDefecto(empresa).stream()
                .filter(estado -> !estadoReparacionRepository.existsByEmpresaIdEmpresaAndCodigo(
                        empresa.getIdEmpresa(), estado.getCodigo()))
                .toList();

        estadoReparacionRepository.saveAll(faltantes);
        return listar(empresa.getIdEmpresa());
    }

    private List<EstadoReparacion> estadosPorDefecto(Empresa empresa) {
        return List.of(
                construirEstado(empresa, RECEPCION,       "Recepción",          (short) 1, false, true),
                construirEstado(empresa, DIAGNOSTICO,     "Diagnóstico",        (short) 2, false, false),
                construirEstado(empresa, COTIZACION,      "Cotización",         (short) 3, false, true),
                construirEstado(empresa, EN_REPARACION,   "En reparación",      (short) 4, false, false),
                construirEstado(empresa, CONTROL_CALIDAD, "Control de calidad", (short) 5, false, false),
                construirEstado(empresa, LISTO_ENTREGA,   "Listo para entrega", (short) 6, false, true),
                construirEstado(empresa, ENTREGADO,       "Entregado",          (short) 7, true,  true),
                construirEstado(empresa, CANCELADO,       "Cancelado",          (short) 8, true,  true)
        );
    }

    private EstadoReparacion construirEstado(Empresa empresa, CodigoEstadoReparacion codigo, String nombre,
                                              short orden, boolean esFinal, boolean notificarCliente) {
        EstadoReparacion estado = new EstadoReparacion();
        estado.setEmpresa(empresa);
        estado.setCodigo(codigo);
        estado.setNombre(nombre);
        estado.setOrden(orden);
        estado.setEsEstadoFinal(esFinal);
        estado.setNotificarCliente(notificarCliente);
        // colorHex usa el default "#6B7280" definido en la entidad
        return estado;
    }

    private void validarNombreUnico(Long empresaId, String nombre, Integer idEstadoExcluir) {
        boolean existe = estadoReparacionRepository.existsByEmpresaIdEmpresaAndNombreIgnoreCase(empresaId, nombre);

        if (existe) {
            if (idEstadoExcluir != null) {
                EstadoReparacion actual = buscarEstado(idEstadoExcluir, empresaId);
                if (actual.getNombre().equalsIgnoreCase(nombre)) {
                    return; // no cambió el nombre, no hay conflicto real
                }
            }
            throw new IllegalArgumentException("Ya existe un estado con ese nombre en la empresa");
        }
    }

    private EstadoReparacion buscarEstado(Integer idEstado, Long empresaId) {
        return estadoReparacionRepository.findByIdEstadoAndEmpresaIdEmpresa(idEstado, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estado de reparación no encontrado"));
    }

    private EstadoReparacionResponse mapearResponse(EstadoReparacion estado) {
        return new EstadoReparacionResponse(
                estado.getIdEstado(),
                estado.getEmpresa().getIdEmpresa(),
                estado.getNombre(),
                estado.getCodigo(),
                estado.getColorHex(),
                estado.getOrden(),
                estado.getEsEstadoFinal(),
                estado.getNotificarCliente()
        );
    }
}
