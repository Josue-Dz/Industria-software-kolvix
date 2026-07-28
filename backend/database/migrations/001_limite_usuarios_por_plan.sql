-- ============================================================
--  Límite de usuarios activos por plan de suscripción
-- ============================================================

ALTER TABLE planes_suscripcion
    ADD COLUMN max_usuarios INT
        CHECK (max_usuarios IS NULL OR max_usuarios > 0);

COMMENT ON COLUMN planes_suscripcion.max_usuarios IS
    'Cupo de usuarios activos que permite el plan. NULL = ilimitado.';

UPDATE planes_suscripcion SET max_usuarios = 2    WHERE codigo = 'BASICO';
UPDATE planes_suscripcion SET max_usuarios = 5    WHERE codigo = 'PROFESIONAL';
UPDATE planes_suscripcion SET max_usuarios = NULL WHERE codigo = 'EMPRESARIAL';
