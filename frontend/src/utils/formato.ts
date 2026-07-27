export const formatoLempiras = (valor: number): string =>
  `L. ${valor.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatoFechaHora = (iso: string | null): string =>
  iso
    ? new Date(iso).toLocaleString('es-HN', { dateStyle: 'short', timeStyle: 'short' })
    : 'Sin fecha';
