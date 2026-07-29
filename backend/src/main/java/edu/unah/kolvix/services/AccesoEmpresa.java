package edu.unah.kolvix.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.repositories.ChecklistRecepcionRepository;
import edu.unah.kolvix.repositories.ClienteRepository;
import edu.unah.kolvix.repositories.DispositivoRepository;
import edu.unah.kolvix.repositories.EvidenciaFotograficaRepository;
import edu.unah.kolvix.repositories.OrdenTrabajoRepository;
import lombok.RequiredArgsConstructor;

/**
 * Aislamiento entre empresas (multi-tenant).
 *
 * Cubre los dos descuidos que se repetían en los controladores:
 *
 * 1. El empresaId llegaba en la URL y se usaba tal cual, así que bastaba con
 *    cambiar ese número para leer o modificar datos de otro taller.
 *
 * 2. Otros endpoints recibían directamente el id del recurso (cliente,
 *    dispositivo, orden, evidencia) sin comprobar de qué empresa era.
 *
 * Los métodos responden 404 y no 403 cuando el recurso es de otra empresa: un
 * 403 confirmaría que ese id existe.
 */
@Component
@RequiredArgsConstructor
public class AccesoEmpresa {

    private final AuthService authService;
    private final ChecklistRecepcionRepository checklistRecepcionRepository;
    private final ClienteRepository clienteRepository;
    private final DispositivoRepository dispositivoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final EvidenciaFotograficaRepository evidenciaFotograficaRepository;

    /**
     * Comprueba que la empresa indicada en la URL sea la del usuario en sesión
     * y devuelve ese usuario.
     */
    public Usuario validarEmpresa(Long empresaId) {
        Usuario usuario = authService.getUsuarioAutenticado();

        if (empresaId == null || !empresaId.equals(usuario.getEmpresa().getIdEmpresa())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No tienes acceso a la información de otra empresa");
        }

        return usuario;
    }

    /** Empresa del usuario en sesión, para endpoints que no la reciben por URL. */
    public Long empresaActual() {
        return authService.getUsuarioAutenticado().getEmpresa().getIdEmpresa();
    }

    public void validarClientePropio(Long idCliente) {
        if (idCliente == null || clienteRepository
                .findByIdClienteAndEmpresaIdEmpresa(idCliente, empresaActual()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado");
        }
    }

    public void validarDispositivoPropio(Long idDispositivo) {
        Long empresaId = empresaActual();
        boolean propio = idDispositivo != null && dispositivoRepository.findById(idDispositivo)
                .map(dispositivo -> empresaId.equals(dispositivo.getEmpresa().getIdEmpresa()))
                .orElse(false);

        if (!propio) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dispositivo no encontrado");
        }
    }

    public void validarOrdenPropia(Long idOrden) {
        if (idOrden == null || ordenTrabajoRepository
                .findByIdOrdenAndEmpresaIdEmpresa(idOrden, empresaActual()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada");
        }
    }

    public void validarChecklistPropio(Long idChecklist) {
        if (idChecklist == null || checklistRecepcionRepository
                .findByIdChecklistAndOrdenEmpresaIdEmpresa(idChecklist, empresaActual()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Checklist no encontrado");
        }
    }

    public void validarEvidenciaPropia(Long idEvidencia) {
        if (idEvidencia == null || evidenciaFotograficaRepository
                .findByIdEvidenciaAndOrdenEmpresaIdEmpresa(idEvidencia, empresaActual()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evidencia no encontrada");
        }
    }
}
