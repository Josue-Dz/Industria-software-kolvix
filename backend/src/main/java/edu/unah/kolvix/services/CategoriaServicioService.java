package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.marketplace.CategoriaServicioRequest;
import edu.unah.kolvix.dtos.marketplace.CategoriaServicioResponse;
import edu.unah.kolvix.entities.CategoriaDispositivo;
import edu.unah.kolvix.entities.CategoriaServicio;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.repositories.CategoriaDispositivoRepository;
import edu.unah.kolvix.repositories.CategoriaServicioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaServicioService {
    
    private final CategoriaServicioRepository categoriaServicioRepository;
    private final CategoriaDispositivoRepository categoriaDispositivoRepository;

    public List<CategoriaServicioResponse> listar(Long empresaId) {
        return categoriaServicioRepository.findByEmpresaIdEmpresaOrderByCategoriaNombreAsc(empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional
    public CategoriaServicioResponse agregar(CategoriaServicioRequest request, Empresa empresa) {
        CategoriaDispositivo categoria = categoriaDispositivoRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La categoría no existe"));

        boolean yaExiste = categoriaServicioRepository.existsByEmpresaIdEmpresaAndCategoriaIdCategoria(
                empresa.getIdEmpresa(), request.categoriaId());
        if (yaExiste) {
            throw new IllegalArgumentException("Esa categoría ya está agregada a tu taller");
        }

        CategoriaServicio cs = new CategoriaServicio();
        cs.setEmpresa(empresa);
        cs.setCategoria(categoria);

        cs = categoriaServicioRepository.save(cs);
        return mapearResponse(cs);
    }

    @Transactional
    public void quitar(Integer id, Long empresaId) {
        CategoriaServicio cs = categoriaServicioRepository.findByIdAndEmpresaIdEmpresa(id, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Esa categoría no está asignada a tu taller"));
        categoriaServicioRepository.delete(cs);
    }

    private CategoriaServicioResponse mapearResponse(CategoriaServicio cs) {
        return new CategoriaServicioResponse(
                cs.getId(),
                cs.getEmpresa().getIdEmpresa(),
                cs.getCategoria().getIdCategoria(),
                cs.getCategoria().getNombre()
        );
    }

}
