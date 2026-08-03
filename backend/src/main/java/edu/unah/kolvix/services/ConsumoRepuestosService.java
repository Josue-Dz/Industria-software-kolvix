package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.inventario.MovimientoInventarioRequest;
import edu.unah.kolvix.entities.Diagnostico;
import edu.unah.kolvix.entities.DiagnosticoRepuesto;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.entities.RepuestoOrden;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.enums.TipoMovimientoInventario;
import edu.unah.kolvix.repositories.DiagnosticoRepuestoRepository;
import edu.unah.kolvix.repositories.DiagnosticoRepository;
import edu.unah.kolvix.repositories.RepuestoOrdenRepository;
import lombok.RequiredArgsConstructor;

/**
 * Salida de inventario por reparacion.
 *
 * Separa lo presupuestado de lo consumido: diagnosticos_repuestos es la
 * propuesta que alimenta la cotizacion, y repuestos_ordenes es lo que
 * realmente salio de bodega.
 */
@Service
@RequiredArgsConstructor
public class ConsumoRepuestosService {

    private final DiagnosticoRepository diagnosticoRepository;
    private final DiagnosticoRepuestoRepository diagnosticoRepuestoRepository;
    private final RepuestoOrdenRepository repuestoOrdenRepository;
    private final MovimientoInventarioService movimientoInventarioService;

    /**
     * Descarga del inventario los repuestos del diagnostico. Se llama al entrar
     * a "En reparacion", que es cuando el tecnico toma las piezas.
     *
     * Es idempotente: si la orden vuelve a pasar por ese estado no se descuenta
     * dos veces.
     */
    @Transactional
    public void consumirRepuestosDelDiagnostico(OrdenTrabajo orden, Usuario usuario) {
        Long empresaId = orden.getEmpresa().getIdEmpresa();

        if (!repuestoOrdenRepository.findByOrdenIdOrdenAndOrdenEmpresaIdEmpresaOrderByIdAsc(
                orden.getIdOrden(), empresaId).isEmpty()) {
            return;
        }

        Diagnostico diagnostico = diagnosticoRepository
                .findByOrdenIdOrdenAndEmpresaIdEmpresa(orden.getIdOrden(), empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                        "La orden no tiene diagnóstico: no se puede iniciar la reparación"));

        List<DiagnosticoRepuesto> lineas = diagnosticoRepuestoRepository
                .findByDiagnosticoIdDiagnosticoAndEmpresaIdEmpresaOrderByIdAsc(
                        diagnostico.getIdDiagnostico(), empresaId);

        for (DiagnosticoRepuesto linea : lineas) {
            // Las lineas sin repuesto son piezas compradas a proveedor: no estan
            // en inventario, asi que no hay stock que descontar.
            if (linea.getRepuesto() == null) {
                continue;
            }

            RepuestoOrden consumo = new RepuestoOrden();
            consumo.setOrden(orden);
            consumo.setRepuesto(linea.getRepuesto());
            consumo.setCantidad(linea.getCantidad());
            consumo.setPrecioUnitario(linea.getPrecioUnitario());
            repuestoOrdenRepository.save(consumo);

            // Reutiliza el servicio de movimientos para no duplicar la validacion
            // de stock ni el registro
            movimientoInventarioService.registrar(new MovimientoInventarioRequest(
                    linea.getRepuesto().getIdRepuesto(),
                    orden.getIdOrden(),
                    usuario.getIdUsuario(),
                    TipoMovimientoInventario.SALIDA,
                    linea.getCantidad(),
                    linea.getPrecioUnitario(),
                    "Salida por reparación de la orden " + orden.getNumeroOrden()
            ), usuario);
        }
    }
}
