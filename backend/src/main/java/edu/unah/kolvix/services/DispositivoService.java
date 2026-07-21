package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.cliente.DispositivoRequest;
import edu.unah.kolvix.dtos.cliente.DispositivoResponse;
import edu.unah.kolvix.entities.CategoriaDispositivo;
import edu.unah.kolvix.entities.Cliente;
import edu.unah.kolvix.entities.Dispositivo;
import edu.unah.kolvix.repositories.CategoriaDispositivoRepository;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.DispositivoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DispositivoService {

    private final DispositivoRepository dispositivoRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaDispositivoRepository categoriaDispositivoRepository;

    @Transactional
    public DispositivoResponse crearDispositivo(DispositivoRequest request) {
        Cliente cliente = clienteRepository.findById(request.idCliente())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El cliente no existe"));

        CategoriaDispositivo categoria = categoriaDispositivoRepository.findById(request.idCategoria())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La categoría del dispositivo no existe"));

        Dispositivo dispositivo = new Dispositivo();
        dispositivo.setEmpresa(cliente.getEmpresa());
        dispositivo.setCliente(cliente);
        dispositivo.setCategoria(categoria);
        dispositivo.setMarca(normalizarTexto(request.marca()));
        dispositivo.setModelo(normalizarTexto(request.modelo()));
        dispositivo.setNumeroSerie(normalizarTexto(request.numeroSerie()));
        dispositivo.setColor(normalizarTexto(request.color()));
        dispositivo.setDescripcionEquipo(normalizarTexto(request.descripcionDispositivo()));
        dispositivo.setAccesoriosRecibidos(normalizarTexto(request.accesoriosRecibidos()));

        return mapearResponse(dispositivoRepository.save(dispositivo));
    }

    public List<DispositivoResponse> listarDispositivosPorCliente(Long idCliente) {
        clienteRepository.findById(idCliente)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El cliente no existe"));

        return dispositivoRepository.findByClienteIdClienteOrderByIdDispositivoDesc(idCliente)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional
    public DispositivoResponse editarDispositivo(Long idDispositivo, DispositivoRequest request) {
        Dispositivo dispositivo = dispositivoRepository.findById(idDispositivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El dispositivo no existe"));

        CategoriaDispositivo categoria = categoriaDispositivoRepository.findById(request.idCategoria())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La categoría del dispositivo no existe"));

        dispositivo.setCategoria(categoria);
        dispositivo.setMarca(normalizarTexto(request.marca()));
        dispositivo.setModelo(normalizarTexto(request.modelo()));
        dispositivo.setNumeroSerie(normalizarTexto(request.numeroSerie()));
        dispositivo.setColor(normalizarTexto(request.color()));
        dispositivo.setDescripcionEquipo(normalizarTexto(request.descripcionDispositivo()));
        dispositivo.setAccesoriosRecibidos(normalizarTexto(request.accesoriosRecibidos()));

        return mapearResponse(dispositivoRepository.save(dispositivo));
    }

    private DispositivoResponse mapearResponse(Dispositivo dispositivo) {
        return new DispositivoResponse(
                dispositivo.getIdDispositivo(),
                dispositivo.getEmpresa() != null ? dispositivo.getEmpresa().getIdEmpresa() : null,
                dispositivo.getCliente() != null ? dispositivo.getCliente().getIdCliente() : null,
                dispositivo.getCategoria() != null ? Long.valueOf(dispositivo.getCategoria().getIdCategoria()) : null,
                dispositivo.getCategoria() != null ? dispositivo.getCategoria().getNombre() : null,
                dispositivo.getMarca(),
                dispositivo.getModelo(),
                dispositivo.getNumeroSerie(),
                dispositivo.getColor(),
                dispositivo.getDescripcionEquipo(),
                dispositivo.getAccesoriosRecibidos()
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
