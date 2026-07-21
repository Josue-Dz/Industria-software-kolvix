package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.orden.EstadoReparacionRequest;
import edu.unah.kolvix.dtos.orden.EstadoReparacionResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.EstadoReparacion;
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

    // Estados base que trae toda empresa nueva al registrarse (ver DDL, sección
    // comentada de estados_reparacion). Se llama desde EmpresaService.
    @Transactional
    public void crearEstadosPorDefecto(Empresa empresa) {
        List<EstadoReparacion> estadosDefault = List.of(
                construirEstado(empresa, "Solicitud recibida",  (short) 1,  false, true),
                construirEstado(empresa, "Recepcion",            (short) 2,  false, true),
                construirEstado(empresa, "Diagnostico",           (short) 3,  false, false),
                construirEstado(empresa, "Cotizacion",             (short) 4,  false, true),
                construirEstado(empresa, "Aprobado",               (short) 5,  false, false),
                construirEstado(empresa, "Rechazado",              (short) 6,  true,  true),
                construirEstado(empresa, "En reparacion",          (short) 7,  false, false),
                construirEstado(empresa, "Control de calidad",     (short) 8,  false, false),
                construirEstado(empresa, "Listo para entrega",     (short) 9,  false, true),
                construirEstado(empresa, "Entregado",              (short) 10, true,  true),
                construirEstado(empresa, "Cerrado",                (short) 11, true,  false)
        );

        estadoReparacionRepository.saveAll(estadosDefault);
    }

    private EstadoReparacion construirEstado(Empresa empresa, String nombre, short orden,
                                              boolean esFinal, boolean notificarCliente) {
        EstadoReparacion estado = new EstadoReparacion();
        estado.setEmpresa(empresa);
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
                estado.getColorHex(),
                estado.getOrden(),
                estado.getEsEstadoFinal(),
                estado.getNotificarCliente()
        );
    }
}
