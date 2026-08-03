package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.orden.PlantillaInspeccionResponse;
import edu.unah.kolvix.entities.PlantillaInspeccion;
import edu.unah.kolvix.repositories.PlantillaInspeccionRepository;
import lombok.RequiredArgsConstructor;

/**
 * Catalogo global: las plantillas se comparten entre todos los talleres, igual
 * que las categorias de dispositivo, por eso no filtran por empresa.
 */
@Service
@RequiredArgsConstructor
public class PlantillaInspeccionService {

    private final PlantillaInspeccionRepository plantillaInspeccionRepository;

    @Transactional(readOnly = true)
    public List<PlantillaInspeccionResponse> listar(Integer categoriaId) {
        List<PlantillaInspeccion> plantillas = categoriaId == null
                ? plantillaInspeccionRepository.findByActivoTrueOrderByNombreAsc()
                : plantillaInspeccionRepository.findByCategoriaIdCategoriaAndActivoTrueOrderByNombreAsc(categoriaId);

        return plantillas.stream().map(this::mapearResponse).toList();
    }

    @Transactional(readOnly = true)
    public PlantillaInspeccionResponse obtener(Long idPlantilla) {
        return mapearResponse(buscarActiva(idPlantilla));
    }

    @Transactional(readOnly = true)
    public PlantillaInspeccion buscarActiva(Long idPlantilla) {
        return plantillaInspeccionRepository.findByIdPlantillaAndActivoTrue(idPlantilla)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "La plantilla de inspección no existe o está inactiva"));
    }

    private PlantillaInspeccionResponse mapearResponse(PlantillaInspeccion plantilla) {
        return new PlantillaInspeccionResponse(
                plantilla.getIdPlantilla(),
                plantilla.getCategoria().getIdCategoria(),
                plantilla.getCategoria().getNombre(),
                plantilla.getNombre(),
                plantilla.getDescripcion(),
                plantilla.getVistas(),
                plantilla.isActivo()
        );
    }
}
