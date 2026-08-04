import React, { useEffect, useId, useState } from 'react';
import { dispositivosService } from '../../../api/services/dispositivosService';
import type { DispositivoResponse } from '../../../api/types';

const resumir = (dispositivo: DispositivoResponse) =>
  [dispositivo.marca, dispositivo.modelo].filter(Boolean).join(' ') || 'Equipo sin marca ni modelo';

const detallar = (dispositivo: DispositivoResponse) =>
  [dispositivo.nombreCategoria, dispositivo.color, dispositivo.numeroSerie]
    .filter(Boolean)
    .join(' · ');

interface SelectorDispositivoProps {
  clienteId: number | null;
  seleccionado: DispositivoResponse | null;
  onSeleccionar: (dispositivo: DispositivoResponse | null) => void;
}

export const SelectorDispositivo: React.FC<SelectorDispositivoProps> = ({
  clienteId,
  seleccionado,
  onSeleccionar,
}) => {

  const [cargado, setCargado] = useState<{ clienteId: number; lista: DispositivoResponse[] } | null>(
    null
  );
  const campoId = useId();

  useEffect(() => {
    if (clienteId === null) return;
    let activo = true;

    dispositivosService
      .listarPorCliente(clienteId)
      .then((lista) => {
        if (activo) setCargado({ clienteId, lista });
      })
      .catch(() => {
        if (activo) setCargado({ clienteId, lista: [] });
      });

    return () => {
      activo = false;
    };
  }, [clienteId]);

  const dispositivos = cargado?.clienteId === clienteId ? cargado.lista : [];

  if (clienteId === null || dispositivos.length === 0) return null;

  const detalle = seleccionado ? detallar(seleccionado) : '';

  return (
    <div className="input-group">
      <label className="input-label" htmlFor={campoId}>
        Equipo
      </label>
      <select
        id={campoId}
        className="input-field"
        value={seleccionado ? String(seleccionado.idDispositivo) : ''}
        onChange={(evento) =>
          onSeleccionar(
            dispositivos.find((d) => String(d.idDispositivo) === evento.target.value) ?? null
          )
        }
      >
        <option value="">Registrar un equipo nuevo</option>
        {dispositivos.map((dispositivo) => (
          <option key={dispositivo.idDispositivo} value={String(dispositivo.idDispositivo)}>
            {resumir(dispositivo)}
            {dispositivo.nombreCategoria ? ` — ${dispositivo.nombreCategoria}` : ''}
          </option>
        ))}
      </select>
      <span style={{ fontSize: '12px', color: seleccionado ? '#4F46E5' : '#94A3B8' }}>
        {seleccionado
          ? detalle || 'Se reutiliza la ficha de este equipo.'
          : `Este cliente ya tiene ${dispositivos.length} ${
              dispositivos.length === 1 ? 'equipo registrado' : 'equipos registrados'
            }. Elígelo para no duplicarlo.`}
      </span>
    </div>
  );
};
