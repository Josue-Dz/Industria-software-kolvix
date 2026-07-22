package edu.unah.kolvix.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.unah.kolvix.dtos.empresa.CuentaPagoTallerRequest;
import edu.unah.kolvix.dtos.empresa.CuentaPagoTallerResponse;
import edu.unah.kolvix.entities.CuentaPagoTaller;
import edu.unah.kolvix.entities.Empresa;
import edu.unah.kolvix.repositories.CuentaPagoTallerRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CuentaPagoTallerService {

    private final CuentaPagoTallerRepository cuentaPagoTallerRepository;

    @Transactional
    public CuentaPagoTallerResponse crear(CuentaPagoTallerRequest request, Empresa empresa) {
        validarDuplicado(empresa.getIdEmpresa(), request.banco(), request.numeroCuenta(), null);

        CuentaPagoTaller cuenta = new CuentaPagoTaller();
        cuenta.setEmpresa(empresa);
        cuenta.setBanco(request.banco());
        cuenta.setTipoCuenta(request.tipoCuenta());
        cuenta.setNumeroCuenta(request.numeroCuenta());
        cuenta.setTitular(request.titular());
        cuenta.setMoneda(request.moneda());
        cuenta.setInstrucciones(request.instrucciones());
        cuenta.setActivo(true); // nace activa, se desactiva con endpoint aparte

        cuenta = cuentaPagoTallerRepository.save(cuenta);
        return mapearResponse(cuenta);
    }

    // Vista del ADMIN: todas las cuentas (activas e inactivas)
    public List<CuentaPagoTallerResponse> listarTodas(Long empresaId) {
        return cuentaPagoTallerRepository.findByEmpresaIdEmpresaOrderByBancoAsc(empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    // Vista del CLIENTE en seguimiento de orden: solo activas
    public List<CuentaPagoTallerResponse> listarActivas(Long empresaId) {
        return cuentaPagoTallerRepository.findByEmpresaIdEmpresaAndActivoTrueOrderByBancoAsc(empresaId)
                .stream()
                .map(this::mapearResponse)
                .toList();
    }

    @Transactional
    public CuentaPagoTallerResponse editar(Long idCuenta, Long empresaId, CuentaPagoTallerRequest request) {
        CuentaPagoTaller cuenta = buscarCuenta(idCuenta, empresaId);

        validarDuplicado(empresaId, request.banco(), request.numeroCuenta(), idCuenta);

        cuenta.setBanco(request.banco());
        cuenta.setTipoCuenta(request.tipoCuenta());
        cuenta.setNumeroCuenta(request.numeroCuenta());
        cuenta.setTitular(request.titular());
        cuenta.setMoneda(request.moneda());
        cuenta.setInstrucciones(request.instrucciones());

        cuenta = cuentaPagoTallerRepository.save(cuenta);
        return mapearResponse(cuenta);
    }

    @Transactional
    public CuentaPagoTallerResponse cambiarEstado(Long idCuenta, Long empresaId, boolean activo) {
        CuentaPagoTaller cuenta = buscarCuenta(idCuenta, empresaId);
        cuenta.setActivo(activo);
        cuenta = cuentaPagoTallerRepository.save(cuenta);
        return mapearResponse(cuenta);
    }

    private void validarDuplicado(Long empresaId, String banco, String numeroCuenta, Long idCuentaExcluir) {
        boolean existe = cuentaPagoTallerRepository
                .existsByEmpresaIdEmpresaAndBancoIgnoreCaseAndNumeroCuenta(empresaId, banco, numeroCuenta);

        if (existe) {
            if (idCuentaExcluir != null) {
                CuentaPagoTaller actual = buscarCuenta(idCuentaExcluir, empresaId);
                boolean esLaMisma = actual.getBanco().equalsIgnoreCase(banco)
                        && actual.getNumeroCuenta().equals(numeroCuenta);
                if (esLaMisma) return;
            }
            throw new IllegalArgumentException("Ya existe una cuenta con ese banco y número en la empresa");
        }
    }

    private CuentaPagoTaller buscarCuenta(Long idCuenta, Long empresaId) {
        return cuentaPagoTallerRepository.findByIdCuentaAndEmpresaIdEmpresa(idCuenta, empresaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuenta bancaria no encontrada"));
    }

    private CuentaPagoTallerResponse mapearResponse(CuentaPagoTaller cuenta) {
        return new CuentaPagoTallerResponse(
                cuenta.getIdCuenta(),
                cuenta.getBanco(),
                cuenta.getTipoCuenta(),
                cuenta.getNumeroCuenta(),
                cuenta.getTitular(),
                cuenta.getMoneda(),
                cuenta.getInstrucciones(),
                cuenta.isActivo()
        );
    }
    
}
