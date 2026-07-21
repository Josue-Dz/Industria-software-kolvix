package edu.unah.kolvix.services;

import org.springframework.stereotype.Service;

import edu.unah.kolvix.Jwt.RegistroEmpresaResponse;
import edu.unah.kolvix.dtos.empresa.EmpresaRegistroRequest;
import edu.unah.kolvix.dtos.empresa.EmpresaResponse;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.entities.PlanSuscripcion;
import edu.unah.kolvix.entities.Usuario;
import edu.unah.kolvix.repositories.EmpresaRepository;
import edu.unah.kolvix.repositories.PlanSuscripcionRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final PlanSuscripcionRepository planSuscripcionRepository;
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

        EmpresaResponse empresaResponse = new EmpresaResponse(
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

       // Se crea el usuario administrador y se autentica de una vez (cookie)
        Usuario admin = usuarioService.crearUsuarioAdmin(empresa, request);
        authService.generarTokenYCookie(admin, response);
        
        estadoReparacionService.crearEstadosPorDefecto(empresa);

    return new RegistroEmpresaResponse(empresaResponse, authService.mapearUsuarioResponse(admin));
    
    }

}
