package edu.unah.kolvix.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import edu.unah.kolvix.dtos.cliente.ClienteRequest;
import edu.unah.kolvix.dtos.cliente.ClienteResponse;
import edu.unah.kolvix.entities.Cliente;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.EmpresaRepository;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private EmpresaRepository empresaRepository;

    @InjectMocks
    private ClienteService clienteService;

    @Test
    void crearClienteGuardaDatosYGeneraFechaRegistro() {
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa(1L);

        ClienteRequest request = new ClienteRequest(
            "Ana",
            "García",
            "12345678",
            "5555-1111",
            "ana@correo.com",
            "San Pedro"
        );

        when(empresaRepository.findById(1L)).thenReturn(Optional.of(empresa));
        when(clienteRepository.existsByEmpresaIdEmpresaAndDni(1L, "12345678")).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocation -> {
            Cliente cliente = invocation.getArgument(0);
            cliente.setIdCliente(10L);
            return cliente;
        });

        ClienteResponse response = clienteService.crearCliente(1L, request);

        assertEquals("Ana", response.nombre());
        assertEquals(1L, response.idEmpresa());
        assertNotNull(response.fechaRegistro());
        verify(clienteRepository).save(any(Cliente.class));
    }
}
