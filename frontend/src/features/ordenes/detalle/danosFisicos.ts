import type { TipoDanoFisico } from '../../../api/types';

export const TIPOS_DANO: { tipo: TipoDanoFisico; label: string; color: string }[] = [
  { tipo: 'RAYON', label: 'Rayón', color: '#F59E0B' },
  { tipo: 'GOLPE', label: 'Golpe', color: '#EF4444' },
  { tipo: 'FISURA', label: 'Fisura', color: '#8B5CF6' },
  { tipo: 'FALTANTE', label: 'Faltante', color: '#0EA5E9' },
  { tipo: 'MANCHA', label: 'Mancha', color: '#10B981' },
  { tipo: 'OXIDO', label: 'Óxido', color: '#A16207' },
];

export const colorDeTipo = (tipo: TipoDanoFisico): string =>
  TIPOS_DANO.find((t) => t.tipo === tipo)?.color ?? '#64748B';

export const etiquetaDeTipo = (tipo: TipoDanoFisico): string =>
  TIPOS_DANO.find((t) => t.tipo === tipo)?.label ?? tipo;
