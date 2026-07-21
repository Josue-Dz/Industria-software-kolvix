package edu.unah.kolvix.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import edu.unah.kolvix.dtos.orden.OrdenTrabajoRequest;
import edu.unah.kolvix.dtos.orden.OrdenTrabajoResponse;
import edu.unah.kolvix.entities.Cliente;
import edu.unah.kolvix.entities.Dispositivo;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.EstadoReparacion;
import edu.unah.kolvix.entities.OrdenTrabajo;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.DispositivoRepository;
import edu.unah.kolvix.repositories.EmpresaRepository;
import edu.unah.kolvix.repositories.EstadoReparacionRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;

@ExtendWith(MockitoExtension.class)
class OrdenTrabajoServiceTest {

    @Mock
    private OrdenTrabajoRepository ordenTrabajoRepository;

    @Mock
    private EmpresaRepository empresaRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private DispositivoRepository dispositivoRepository;

    @Mock
    private EstadoReparacionRepository estadoReparacionRepository;

    @InjectMocks
    private OrdenTrabajoService ordenTrabajoService;

    @Test
    void crearOrdenTrabajoDebeGenerarNumerosYEstadoInicial() {
        Empresa empresa = new Empresa();
        empresa.setIdEmpresa(1L);

        Cliente cliente = new Cliente();
        cliente.setIdCliente(10L);
        cliente.setEmpresa(empresa);

        Dispositivo dispositivo = new Dispositivo();
        dispositivo.setIdDispositivo(20L);
        dispositivo.setEmpresa(empresa);
        dispositivo.setCliente(cliente);

        EstadoReparacion estadoInicial = new EstadoReparacion();
        estadoInicial.setIdEstado(100);
        estadoInicial.setEmpresa(empresa);
        estadoInicial.setNombre("Recibido");
        estadoInicial.setOrden((short) 1);
        estadoInicial.setColorHex("#3B82F6");
        estadoInicial.setEsEstadoFinal(false);
        estadoInicial.setNotificarCliente(false);

        when(empresaRepository.findById(1L)).thenReturn(Optional.of(empresa));
        when(clienteRepository.findById(10L)).thenReturn(Optional.of(cliente));
        when(dispositivoRepository.findById(20L)).thenReturn(Optional.of(dispositivo));
        when(estadoReparacionRepository.findByEmpresaIdEmpresaOrderByOrdenAsc(1L)).thenReturn(List.of());
        when(estadoReparacionRepository.save(any(EstadoReparacion.class))).thenReturn(estadoInicial);
        when(ordenTrabajoRepository.existsByEmpresaIdEmpresaAndNumeroOrden(eq(1L), anyString())).thenReturn(false);
        when(ordenTrabajoRepository.existsByCodigoSeguimiento(anyString())).thenReturn(false);
        when(ordenTrabajoRepository.save(any(OrdenTrabajo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrdenTrabajoRequest request = new OrdenTrabajoRequest(
                10L,
                20L,
                null,
                "Pantalla rota",
                "Revisar accesorios"
        );

        OrdenTrabajoResponse response = ordenTrabajoService.crearOrdenTrabajo(1L, request);

        assertNotNull(response);
        assertEquals(1L, response.idEmpresa());
        assertNotNull(response.numeroOrden());
        assertNotNull(response.codigoSeguimiento());
        assertEquals("Recibido", response.nombreEstado());
        verify(estadoReparacionRepository).save(any(EstadoReparacion.class));
        verify(ordenTrabajoRepository).save(any(OrdenTrabajo.class));
    }
}
