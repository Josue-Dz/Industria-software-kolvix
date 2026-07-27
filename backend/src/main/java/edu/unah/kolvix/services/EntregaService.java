package edu.unah.kolvix.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.orden.EntregaRequest;
import edu.unah.kolvix.dtos.orden.EntregaResponse;
import edu.unah.kolvix.entities.Entrega;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.repositories.EntregaRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import edu.unah.kolvix.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EntregaService {
    
    private final EntregaRepository entregaRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public EntregaResponse registrarEntrega(Long empresaId, EntregaRequest request) {
        OrdenTrabajo orden = ordenTrabajoRepository.findByIdOrdenAndEmpresaIdEmpresa(request.ordenId(), empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no existe en la empresa"));

        if (entregaRepository.existsByOrdenIdOrden(orden.getIdOrden())) {
            throw new IllegalArgumentException("Esta orden ya tiene un registro de entrega");
        }

        Usuario usuarioEntrega = usuarioRepository.findByIdUsuarioAndEmpresaIdEmpresa(request.usuarioEntregaId(), empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario que entrega no existe en la empresa"));

        if (!request.identidadVerificada()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Debe verificarse la identidad del cliente antes de registrar la entrega");
        }

        Entrega entrega = new Entrega();
        entrega.setOrden(orden);
        entrega.setUsuarioEntrega(usuarioEntrega);
        entrega.setIdentidadVerificada(request.identidadVerificada());
        entrega.setUrlComprobanteEntrega(request.urlComprobanteEntrega());
        entrega.setObservaciones(request.observaciones());

        entrega = entregaRepository.save(entrega);

        // Paso clave: fija fecha_entrega en la orden, lo que habilita reseñas
        // y cuentas de pago en el seguimiento público.
        orden.setFechaEntrega(entrega.getFechaEntrega());
        orden.setUpdatedAt(java.time.Instant.now());
        ordenTrabajoRepository.save(orden);

        return mapearResponse(entrega);
    }

    public EntregaResponse obtenerPorOrden(Long empresaId, Long ordenId) {
        Entrega entrega = entregaRepository.findByOrdenIdOrdenAndOrdenEmpresaIdEmpresa(ordenId, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esta orden no tiene registro de entrega"));
        return mapearResponse(entrega);
    }

    private EntregaResponse mapearResponse(Entrega entrega) {
        Usuario usuario = entrega.getUsuarioEntrega();
        return new EntregaResponse(
                entrega.getIdEntrega(),
                entrega.getOrden().getIdOrden(),
                usuario.getIdUsuario(),
                usuario.getNombre() + " " + usuario.getApellido(),
                entrega.isIdentidadVerificada(),
                entrega.getUrlComprobanteEntrega(),
                entrega.getObservaciones(),
                entrega.getFechaEntrega()
        );
    }

}
