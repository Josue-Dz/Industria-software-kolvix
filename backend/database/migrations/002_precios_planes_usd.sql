-- ============================================================
--  Cambio de precios de los planes de suscripción a USD
--  Solo toca el catálogo planes_suscripcion. No hay FK sobre
--  monto_mensual ni moneda, así que las empresas ya registradas
--  (que referencian el plan por codigo) no se ven afectadas.
-- ============================================================

BEGIN;

-- Estado previo, para dejar constancia antes de modificar.
SELECT codigo, nombre, monto_mensual, moneda, max_usuarios
FROM planes_suscripcion
ORDER BY monto_mensual;

-- updated_at se asigna a mano: la tabla no tiene trigger y el
-- @UpdateTimestamp de Hibernate no aplica a un UPDATE por SQL.
UPDATE planes_suscripcion
SET monto_mensual = 9.99,
    moneda        = 'USD',
    updated_at    = NOW()
WHERE codigo = 'BASICO';

UPDATE planes_suscripcion
SET monto_mensual = 24.99,
    moneda        = 'USD',
    updated_at    = NOW()
WHERE codigo = 'PROFESIONAL';

UPDATE planes_suscripcion
SET monto_mensual = 59.99,
    moneda        = 'USD',
    updated_at    = NOW()
WHERE codigo = 'EMPRESARIAL';

-- Verificación: deben quedar 3 filas en USD y ninguna en HNL.
SELECT codigo, nombre, monto_mensual, moneda, max_usuarios, updated_at
FROM planes_suscripcion
ORDER BY monto_mensual;

COMMIT;
