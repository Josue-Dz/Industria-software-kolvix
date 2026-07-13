package edu.unah.kolvix.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.CuentaCobro;

public interface CuentaCobroRepository extends JpaRepository<CuentaCobro, Long> {

    List<CuentaCobro> findByActivoTrueOrderByBancoAsc();
}
