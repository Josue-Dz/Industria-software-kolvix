package edu.unah.kolvix.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.unah.kolvix.entities.Notificacion;
import edu.unah.kolvix.enums.CanalNotificacion;
import edu.unah.kolvix.enums.EstadoNotificacion;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByEmpresaIdEmpresaOrderByFechaProgramadaDesc(Long empresaId);

    List<Notificacion> findByEmpresaIdEmpresaAndOrdenIdOrdenOrderByFechaProgramadaDesc(Long empresaId, Long ordenId);

    List<Notificacion> findByEmpresaIdEmpresaAndEstadoOrderByFechaProgramadaAsc(
            Long empresaId,
            EstadoNotificacion estado
    );

    List<Notificacion> findByEmpresaIdEmpresaAndCanalOrderByFechaProgramadaDesc(
            Long empresaId,
            CanalNotificacion canal
    );
}
