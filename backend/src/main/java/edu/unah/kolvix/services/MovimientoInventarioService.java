package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.inventario.MovimientoInventarioRequest;
import edu.unah.kolvix.dtos.inventario.MovimientoInventarioResponse;
import edu.unah.kolvix.entities.MovimientoInventario;
import edu.unah.kolvix.entities.Repuesto;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.TipoMovimientoInventario;
import edu.unah.kolvix.repositories.MovimientoInventarioRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import edu.unah.kolvix.repositories.RepuestoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovimientoInventarioService {

    private final MovimientoInventarioRepository movimientoRepository;
    private final RepuestoRepository repuestoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    // ENTRADA y DEVOLUCION suman al stock, SALIDA resta (validando stock suficiente)
    // y AJUSTE fija el stock exactamente en la cantidad indicada.
    @Transactional
    public MovimientoInventarioResponse registrar(MovimientoInventarioRequest request, Usuario usuario) {
        Long empresaId = usuario.getEmpresa().getIdEmpresa();

        Repuesto repuesto = repuestoRepository.findByIdRepuestoAndEmpresaIdEmpresa(request.repuestoId(), empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El repuesto no existe en la empresa"));

        aplicarStock(repuesto, request.tipoMovimiento(), request.cantidad());

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setRepuesto(repuesto);
        movimiento.setUsuario(usuario);
        movimiento.setTipoMovimiento(request.tipoMovimiento());
        movimiento.setCantidad(request.cantidad());
        movimiento.setPrecioUnitario(request.precioUnitario());
        movimiento.setObservacion(request.observacion());

        if (request.ordenId() != null) {
            movimiento.setOrden(ordenTrabajoRepository.findByIdOrdenAndEmpresaIdEmpresa(request.ordenId(), empresaId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La orden no existe en la empresa")));
        }

        repuestoRepository.save(repuesto);
        return mapearResponse(movimientoRepository.save(movimiento));
    }

    @Transactional(readOnly = true)
    public List<MovimientoInventarioResponse> listar(Long empresaId, Long repuestoId, TipoMovimientoInventario tipo) {
        List<MovimientoInventario> movimientos;
        if (repuestoId != null) {
            movimientos = movimientoRepository
                    .findByRepuestoEmpresaIdEmpresaAndRepuestoIdRepuestoOrderByFechaMovimientoDesc(empresaId, repuestoId);
        } else if (tipo != null) {
            movimientos = movimientoRepository
                    .findByRepuestoEmpresaIdEmpresaAndTipoMovimientoOrderByFechaMovimientoDesc(empresaId, tipo);
        } else {
            movimientos = movimientoRepository.findByRepuestoEmpresaIdEmpresaOrderByFechaMovimientoDesc(empresaId);
        }
        return movimientos.stream().map(this::mapearResponse).toList();
    }

    private void aplicarStock(Repuesto repuesto, TipoMovimientoInventario tipo, int cantidad) {
        int stockActual = repuesto.getStockActual();
        switch (tipo) {
            case ENTRADA, DEVOLUCION -> repuesto.setStockActual(stockActual + cantidad);
            case SALIDA -> {
                if (stockActual < cantidad) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "Stock insuficiente: hay " + stockActual + " unidades y se intentan sacar " + cantidad);
                }
                repuesto.setStockActual(stockActual - cantidad);
            }
            case AJUSTE -> repuesto.setStockActual(cantidad);
        }
    }

    private MovimientoInventarioResponse mapearResponse(MovimientoInventario movimiento) {
        Usuario usuario = movimiento.getUsuario();
        return new MovimientoInventarioResponse(
                movimiento.getIdMovimiento(),
                movimiento.getRepuesto().getIdRepuesto(),
                movimiento.getRepuesto().getNombre(),
                movimiento.getOrden() != null ? movimiento.getOrden().getIdOrden() : null,
                usuario != null ? usuario.getIdUsuario() : null,
                usuario != null ? usuario.getNombre() + " " + usuario.getApellido() : null,
                movimiento.getTipoMovimiento(),
                movimiento.getCantidad(),
                movimiento.getPrecioUnitario(),
                movimiento.getObservacion(),
                movimiento.getFechaMovimiento() != null ? movimiento.getFechaMovimiento().toInstant() : null
        );
    }
}
