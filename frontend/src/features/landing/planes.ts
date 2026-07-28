export const PRESENTACION_PLAN: Record<string, { caracteristicas: string[]; destacado: boolean }> = {
    BASICO: {
        caracteristicas: [
            'Registro de órdenes',
            'Gestión básica de clientes'
        ],
        destacado: false,
    },
    PROFESIONAL: {
        caracteristicas: [
            'Todo lo del plan Básico',
            'Evidencia fotográfica',
            'Control de inventario',
            'Notificaciones automáticas',
        ],
        destacado: true,
    },
    EMPRESARIAL: {
        caracteristicas: [
            'Todo lo del plan Profesional',
            'Soporte prioritario',
            'Personalización avanzada',
        ],
        destacado: false,
    },
};


export const vinetaUsuarios = (maxUsuarios: number | null): string =>
    maxUsuarios === null
        ? 'Usuarios ilimitados'
        : `Hasta ${maxUsuarios} ${maxUsuarios === 1 ? 'usuario' : 'usuarios'}`;

export const formatoMonto = (monto: number, moneda: string): string => {
    try {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: moneda,
            minimumFractionDigits: 2,
        }).format(monto);
    } catch {
        return `${moneda} ${monto.toFixed(2)}`;
    }
};
