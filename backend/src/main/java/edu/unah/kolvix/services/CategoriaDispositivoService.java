package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.unah.kolvix.dtos.catalogo.CategoriaDispositivoResponse;
import edu.unah.kolvix.repositories.CategoriaDispositivoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaDispositivoService {

    private final CategoriaDispositivoRepository categoriaDispositivoRepository;

    @Transactional(readOnly = true)
    public List<CategoriaDispositivoResponse> listar() {
        return categoriaDispositivoRepository.findAll()
                .stream()
                .map(categoria -> new CategoriaDispositivoResponse(
                        categoria.getIdCategoria(),
                        categoria.getNombre(),
                        categoria.getDescripcion()))
                .toList();
    }
}
