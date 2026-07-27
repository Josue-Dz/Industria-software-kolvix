package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.inventario.RepuestoRequest;
import edu.unah.kolvix.dtos.inventario.RepuestoResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.Repuesto;
import edu.unah.kolvix.repositories.RepuestoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RepuestoService {

    private final RepuestoRepository repuestoRepository;

    @Transactional
    public RepuestoResponse crear(RepuestoRequest request, Empresa empresa) {
        String codigo = normalizarTexto(request.codigo());
        if (codigo != null && repuestoRepository.existsByEmpresaIdEmpresaAndCodigo(empresa.getIdEmpresa(), codigo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un repuesto con ese código en la empresa");
        }

        Repuesto repuesto = new Repuesto();
        repuesto.setEmpresa(empresa);
        aplicarRequest(repuesto, request, codigo);

        return mapearResponse(repuestoRepository.save(repuesto));
    }

    @Transactional(readOnly = true)
    public List<RepuestoResponse> listarActivos(Long empresaId) {
        return repuestoRepository.findByEmpresaIdEmpresaAndActivoTrueOrderByNombreAsc(empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional
    public RepuestoResponse editar(Long idRepuesto, Long empresaId, RepuestoRequest request) {
        Repuesto repuesto = repuestoRepository.findByIdRepuestoAndEmpresaIdEmpresa(idRepuesto, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El repuesto no existe en la empresa"));

        String codigo = normalizarTexto(request.codigo());
        if (codigo != null
                && !codigo.equals(repuesto.getCodigo())
                && repuestoRepository.existsByEmpresaIdEmpresaAndCodigo(empresaId, codigo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un repuesto con ese código en la empresa");
        }

        aplicarRequest(repuesto, request, codigo);
        return mapearResponse(repuestoRepository.save(repuesto));
    }

    private void aplicarRequest(Repuesto repuesto, RepuestoRequest request, String codigo) {
        repuesto.setNombre(request.nombre().trim());
        repuesto.setCodigo(codigo);
        repuesto.setMarca(normalizarTexto(request.marca()));
        repuesto.setStockActual(request.stockActual());
        repuesto.setStockMinimo(request.stockMinimo());
        repuesto.setPrecioCosto(request.precioCosto());
        repuesto.setPrecioVenta(request.precioVenta());
        repuesto.setActivo(request.activo());
    }

    private RepuestoResponse mapearResponse(Repuesto repuesto) {
        return new RepuestoResponse(
                repuesto.getIdRepuesto(),
                repuesto.getEmpresa() != null ? repuesto.getEmpresa().getIdEmpresa() : null,
                repuesto.getNombre(),
                repuesto.getCodigo(),
                repuesto.getMarca(),
                repuesto.getStockActual(),
                repuesto.getStockMinimo(),
                repuesto.getPrecioCosto(),
                repuesto.getPrecioVenta(),
                repuesto.isActivo(),
                repuesto.getStockActual() <= repuesto.getStockMinimo()
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
