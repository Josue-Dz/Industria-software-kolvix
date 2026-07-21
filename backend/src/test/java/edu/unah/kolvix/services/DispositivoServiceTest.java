package edu.unah.kolvix.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import edu.unah.kolvix.dtos.cliente.DispositivoRequest;
import edu.unah.kolvix.dtos.cliente.DispositivoResponse;
import edu.unah.kolvix.entities.CategoriaDispositivo;
import edu.unah.kolvix.entities.Cliente;
import edu.unah.kolvix.entities.Dispositivo;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.repositories.CategoriaDispositivoRepository;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.DispositivoRepository;

@ExtendWith(MockitoExtension.class)
class DispositivoServiceTest {

    @Mock
    private DispositivoRepository dispositivoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private CategoriaDispositivoRepository categoriaDispositivoRepository;

    @InjectMocks
    private DispositivoService dispositivoService;

    @Test
    void crearDispositivoUsaLaEmpresaDelUsuarioAutenticado() {
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa(3L);

        Cliente cliente = new Cliente();
        cliente.setIdCliente(10L);
        cliente.setEmpresa(empresa);

        CategoriaDispositivo categoria = new CategoriaDispositivo();
        categoria.setIdCategoria(4);
        categoria.setNombre("Laptop");

        DispositivoRequest request = new DispositivoRequest(
            10L,
            4,
            "Dell",
            "Latitude",
            "SN-123",
            "Negro",
            "Equipo para soporte",
            "Cable y cargador"
        );

        when(clienteRepository.findById(10L)).thenReturn(Optional.of(cliente));
        when(categoriaDispositivoRepository.findById(4)).thenReturn(Optional.of(categoria));
        when(dispositivoRepository.save(any(Dispositivo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DispositivoResponse response = dispositivoService.crearDispositivo(request);

        assertEquals(3L, response.idEmpresa());
        assertEquals(10L, response.idCliente());
        verify(dispositivoRepository).save(any(Dispositivo.class));
    }
}
