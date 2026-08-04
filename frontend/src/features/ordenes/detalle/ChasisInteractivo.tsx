import React, { useMemo, useState } from 'react';
import type { DanoFisico, TipoDanoFisico, VistaChasis } from '../../../api/types';
import { SiluetaChasis } from './SiluetaChasis';
import { TIPOS_DANO, colorDeTipo, etiquetaDeTipo } from './danosFisicos';

interface ChasisInteractivoProps {
  categoriaId: number | null;
  vistas: VistaChasis[];
  danos: DanoFisico[];
  onChange?: (danos: DanoFisico[]) => void;
  readOnly?: boolean;
}

export const ChasisInteractivo: React.FC<ChasisInteractivoProps> = ({
  categoriaId,
  vistas,
  danos,
  onChange,
  readOnly = false,
}) => {
  const vistasOrdenadas = useMemo(
    () => [...vistas].sort((a, b) => a.orden - b.orden),
    [vistas]
  );

  const [vistaActiva, setVistaActiva] = useState(() => vistasOrdenadas[0]?.codigo ?? 'FRONTAL');
  const [tipoActivo, setTipoActivo] = useState<TipoDanoFisico>('RAYON');

  const vistaVigente = vistasOrdenadas.some((v) => v.codigo === vistaActiva)
    ? vistaActiva
    : vistasOrdenadas[0]?.codigo ?? 'FRONTAL';

  const danosDeVista = danos.filter((d) => d.vista === vistaVigente);

  const marcar = (evento: React.MouseEvent<SVGSVGElement>) => {
    if (readOnly || !onChange) return;

    const caja = evento.currentTarget.getBoundingClientRect();
    const x = ((evento.clientX - caja.left) / caja.width) * 100;
    const y = ((evento.clientY - caja.top) / caja.height) * 100;

    onChange([
      ...danos,
      {
        vista: vistaVigente,
        x: Math.round(Math.min(100, Math.max(0, x)) * 10) / 10,
        y: Math.round(Math.min(100, Math.max(0, y)) * 10) / 10,
        tipo: tipoActivo,
        nota: null,
      },
    ]);
  };

  const quitar = (dano: DanoFisico) => {
    if (readOnly || !onChange) return;
    onChange(danos.filter((d) => d !== dano));
  };

  const cambiarNota = (dano: DanoFisico, nota: string) => {
    if (readOnly || !onChange) return;
    onChange(danos.map((d) => (d === dano ? { ...d, nota: nota || null } : d)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {vistasOrdenadas.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {vistasOrdenadas.map((vista) => {
            const activa = vista.codigo === vistaVigente;
            const marcas = danos.filter((d) => d.vista === vista.codigo).length;
            return (
              <button
                key={vista.codigo}
                type="button"
                onClick={() => setVistaActiva(vista.codigo)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: `1px solid ${activa ? '#6366F1' : '#E2E8F0'}`,
                  backgroundColor: activa ? '#EEF2FF' : '#FFFFFF',
                  color: activa ? '#3730A3' : '#64748B',
                  fontSize: 13,
                  fontWeight: activa ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {vista.titulo}
                {marcas > 0 && (
                  <span style={{ marginLeft: 6, fontSize: 11, color: '#EF4444', fontWeight: 700 }}>
                    {marcas}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!readOnly && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748B', marginRight: 4 }}>Marcar como:</span>
          {TIPOS_DANO.map(({ tipo, label, color }) => {
            const activo = tipo === tipoActivo;
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => setTipoActivo(tipo)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 999,
                  border: `1px solid ${activo ? color : '#E2E8F0'}`,
                  backgroundColor: activo ? `${color}1A` : '#FFFFFF',
                  color: activo ? '#0F172A' : '#64748B',
                  fontSize: 12,
                  fontWeight: activo ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: color }} />
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div
        style={{
          maxWidth: 340,
          width: '100%',
          margin: '0 auto',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          padding: 8,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          onClick={marcar}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            display: 'block',
            cursor: readOnly ? 'default' : 'crosshair',
            touchAction: 'manipulation',
          }}
        >
          <SiluetaChasis categoriaId={categoriaId} vista={vistaVigente} />

          {danosDeVista.map((dano, indice) => (
            <g key={`${dano.x}-${dano.y}-${indice}`}>
              <circle
                cx={dano.x}
                cy={dano.y}
                r={2.8}
                fill={colorDeTipo(dano.tipo)}
                fillOpacity={0.85}
                stroke="#FFFFFF"
                strokeWidth={0.8}
                onClick={(evento) => {
                  evento.stopPropagation();
                  quitar(dano);
                }}
                style={{ cursor: readOnly ? 'default' : 'pointer' }}
              >
                <title>
                  {etiquetaDeTipo(dano.tipo)}
                  {dano.nota ? ` — ${dano.nota}` : ''}
                  {readOnly ? '' : ' (clic para quitar)'}
                </title>
              </circle>
            </g>
          ))}
        </svg>
      </div>

      {!readOnly && (
        <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', margin: 0 }}>
          Hacé clic sobre el equipo para marcar un daño. Clic sobre una marca para quitarla.
        </p>
      )}

      {danosDeVista.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {danosDeVista.map((dano, indice) => (
            <div
              key={`detalle-${dano.x}-${dano.y}-${indice}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: colorDeTipo(dano.tipo),
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', minWidth: 64 }}>
                {etiquetaDeTipo(dano.tipo)}
              </span>
              {readOnly ? (
                <span style={{ fontSize: 13, color: '#64748B', flex: 1 }}>{dano.nota || 'Sin nota'}</span>
              ) : (
                <>
                  <input
                    type="text"
                    value={dano.nota ?? ''}
                    maxLength={160}
                    placeholder="Nota (opcional)"
                    onChange={(evento) => cambiarNota(dano, evento.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '5px 8px',
                      border: '1px solid #E2E8F0',
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => quitar(dano)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Quitar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
