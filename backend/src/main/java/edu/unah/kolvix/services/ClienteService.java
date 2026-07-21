package edu.unah.kolvix.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.cliente.ClienteRequest;
import edu.unah.kolvix.dtos.cliente.ClienteResponse;
import edu.unah.kolvix.entities.Cliente;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.EmpresaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;

    @Transactional
    public ClienteResponse crearCliente(Long empresaId, ClienteRequest request) {
        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La empresa no existe"));

        String dni = normalizarTexto(request.dni());
        if (dni != null && clienteRepository.existsByEmpresaIdEmpresaAndDni(empresaId, dni)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un cliente con ese DNI en la empresa");
        }

        Cliente cliente = new Cliente();
        cliente.setEmpresa(empresa);
        cliente.setNombre(normalizarTexto(request.nombre()));
        cliente.setApellido(normalizarTexto(request.apellido()));
        cliente.setDni(dni);
        cliente.setTelefono(normalizarTexto(request.telefono()));
        cliente.setCorreo(normalizarTexto(request.correo()));
        cliente.setDireccion(normalizarTexto(request.direccion()));
        cliente.setFechaRegistro(Instant.now());

        return mapearResponse(clienteRepository.save(cliente));
    }

    public List<ClienteResponse> listarClientesPorEmpresa(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La empresa no existe");
        }

        return clienteRepository.findByEmpresaIdEmpresaOrderByFechaRegistroDesc(empresaId)
            .stream()
            .map(this::mapearResponse)
            .toList();
    }

    @Transactional
    public ClienteResponse editarCliente(Long idCliente, Long empresaId, ClienteRequest request) {
        Cliente cliente = clienteRepository.findByIdClienteAndEmpresaIdEmpresa(idCliente, empresaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El cliente no existe en la empresa"));

        String dni = normalizarTexto(request.dni());
        if (dni != null) {
            Optional<Cliente> clienteConDni = clienteRepository.findByEmpresaIdEmpresaAndDni(empresaId, dni);
            if (clienteConDni.isPresent() && !clienteConDni.get().getIdCliente().equals(idCliente)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un cliente con ese DNI en la empresa");
            }
        }

        cliente.setNombre(normalizarTexto(request.nombre()));
        cliente.setApellido(normalizarTexto(request.apellido()));
        cliente.setDni(dni);
        cliente.setTelefono(normalizarTexto(request.telefono()));
        cliente.setCorreo(normalizarTexto(request.correo()));
        cliente.setDireccion(normalizarTexto(request.direccion()));

        return mapearResponse(clienteRepository.save(cliente));
    }

    private ClienteResponse mapearResponse(Cliente cliente) {
        return new ClienteResponse(
            cliente.getIdCliente(),
            cliente.getEmpresa() != null ? cliente.getEmpresa().getIdEmpresa() : null,
            cliente.getNombre(),
            cliente.getApellido(),
            cliente.getDni(),
            cliente.getTelefono(),
            cliente.getCorreo(),
            cliente.getDireccion(),
            cliente.getFechaRegistro()
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
