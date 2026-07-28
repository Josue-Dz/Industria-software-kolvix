package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.Jwt.RegistroEmpresaResponse;
import edu.unah.kolvix.dtos.catalogo.CuentaCobroResponse;
import edu.unah.kolvix.dtos.catalogo.PlanSuscripcionResponse;
import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.dtos.empresa.EmpresaResponse;
import edu.unah.kolvix.dtos.empresa.EmpresaUpdateRequest;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.PlanSuscripcion;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.repositories.CuentaCobroRepository;
import edu.unah.kolvix.repositories.EmpresaRepository;
import edu.unah.kolvix.repositories.PlanSuscripcionRepository;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final PlanSuscripcionRepository planSuscripcionRepository;
    private final CuentaCobroRepository cuentaCobroRepository;
    private final AuthService authService;
    private final UsuarioService usuarioService;
    private final EstadoReparacionService estadoReparacionService;

    @Transactional
    public RegistroEmpresaResponse registrarEmpresa(EmpresaRegistroRequest request, HttpServletResponse response) {

        boolean existeCorreo = empresaRepository.existsByCorreoIgnoreCase(request.correo());
        PlanSuscripcion plan = planSuscripcionRepository.findById(request.codigoPlan()).orElseThrow(
            () -> new IllegalArgumentException("El plan de suscripción no existe")
        );

        if(existeCorreo){
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        Empresa empresa = new Empresa();
        empresa.setNombre(request.nombre());
        empresa.setRtn(request.rtn().isBlank() ? null : request.rtn());
        empresa.setTelefono(request.telefono());
        empresa.setCorreo(request.correo());
        empresa.setDireccion(request.direccion());
        empresa.setPlanSuscripcion(plan);

        empresa = empresaRepository.save(empresa);

        EmpresaResponse empresaResponse = mapearResponse(empresa);

       // Se crea el usuario administrador y se autentica de una vez (cookie)
        Usuario admin = usuarioService.crearUsuarioAdmin(empresa, request);
        authService.generarTokenYCookie(admin, response);

        estadoReparacionService.crearEstadosPorDefecto(empresa);

    return new RegistroEmpresaResponse(empresaResponse, authService.mapearUsuarioResponse(admin));

    }

    @Transactional(readOnly = true)
    public EmpresaResponse obtener(Long empresaId) {
        return mapearResponse(buscarEmpresa(empresaId));
    }

    @Transactional
    public EmpresaResponse actualizar(Long empresaId, EmpresaUpdateRequest request) {
        Empresa empresa = buscarEmpresa(empresaId);

        String correo = request.correo().trim();
        if (!correo.equalsIgnoreCase(empresa.getCorreo())
                && empresaRepository.existsByCorreoIgnoreCase(correo)) {
            throw new IllegalArgumentException("El correo ya está registrado por otra empresa");
        }

        empresa.setNombre(request.nombre().trim());
        empresa.setRtn(normalizarTexto(request.rtn()));
        empresa.setTelefono(normalizarTexto(request.telefono()));
        empresa.setCorreo(correo);
        empresa.setDireccion(normalizarTexto(request.direccion()));

        return mapearResponse(empresaRepository.save(empresa));
    }

    // Catálogo de planes disponibles, para mostrar el plan contratado y sus alternativas.
    @Transactional(readOnly = true)
    public List<PlanSuscripcionResponse> listarPlanes() {
        return planSuscripcionRepository.findAll()
                .stream()
                .filter(PlanSuscripcion::isActivo)
                .map(plan -> new PlanSuscripcionResponse(
                        plan.getCodigo(),
                        plan.getNombre(),
                        plan.getDescripcion(),
                        plan.getMontoMensual(),
                        plan.getMoneda(),
                        plan.isActivo()
                ))
                .toList();
    }

    // Cuentas donde el taller paga su suscripción a Kolvix (catálogo global).
    @Transactional(readOnly = true)
    public List<CuentaCobroResponse> listarCuentasCobro() {
        return cuentaCobroRepository.findByActivoTrueOrderByBancoAsc()
                .stream()
                .map(cuenta -> new CuentaCobroResponse(
                        cuenta.getIdCuenta(),
                        cuenta.getBanco(),
                        cuenta.getTipoCuenta(),
                        cuenta.getNumeroCuenta(),
                        cuenta.getTitular(),
                        cuenta.getMoneda(),
                        cuenta.getInstrucciones(),
                        cuenta.isActivo()
                ))
                .toList();
    }

    private Empresa buscarEmpresa(Long empresaId) {
        return empresaRepository.findById(empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La empresa no existe"));
    }

    private EmpresaResponse mapearResponse(Empresa empresa) {
        return new EmpresaResponse(
                empresa.getIdEmpresa(),
                empresa.getNombre(),
                empresa.getRtn(),
                empresa.getTelefono(),
                empresa.getCorreo(),
                empresa.getDireccion(),
                empresa.getPlanSuscripcion().getCodigo(),
                empresa.getPlanSuscripcion().getNombre(),
                empresa.isActivo(),
                empresa.getFechaRegistro()
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
