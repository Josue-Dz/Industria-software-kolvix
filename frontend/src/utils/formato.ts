export const formatoLempiras = (valor: number): string =>
  `L. ${valor.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Minúsculas y sin tildes, para comparar nombres configurables (ej. estados de reparación).
export const normalizarTexto = (texto: string): string =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export const formatoFechaHora = (iso: string | null): string =>
  iso
    ? new Date(iso).toLocaleString('es-HN', { dateStyle: 'short', timeStyle: 'short' })
    : 'Sin fecha';
