import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, X, Phone, IdCard } from 'lucide-react';
import type { ClienteResponse } from '../../../api/types';

const MIN_CARACTERES = 2;
const MAX_RESULTADOS = 6;

// De momento busqueda solo en minúscula, se considerará actualizar en un futuro.
const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const coincide = (cliente: ClienteResponse, terminos: string[]) => {
  const campos = normalizar(
    [cliente.nombre, cliente.apellido, cliente.telefono, cliente.dni, cliente.correo]
      .filter(Boolean)
      .join(' ')
  );
  return terminos.every((termino) => campos.includes(termino));
};

interface BuscadorClienteProps {
  clientes: ClienteResponse[];
  seleccionado: ClienteResponse | null;
  onSeleccionar: (cliente: ClienteResponse | null) => void;
}

export const BuscadorCliente: React.FC<BuscadorClienteProps> = ({
  clientes,
  seleccionado,
  onSeleccionar,
}) => {
  const [consulta, setConsulta] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const listaId = useId();

  const buscando = consulta.trim().length >= MIN_CARACTERES;

  // Nunca se listan todos los clientes, sin consulta no hay resultados.
  const coincidencias = useMemo(() => {
    if (!buscando) return [];
    const terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
    return clientes.filter((cliente) => coincide(cliente, terminos));
  }, [buscando, clientes, consulta]);

  const resultados = coincidencias.slice(0, MAX_RESULTADOS);
  const desplegado = abierto && buscando;

  useEffect(() => {
    const alClicarFuera = (evento: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', alClicarFuera);
    return () => document.removeEventListener('mousedown', alClicarFuera);
  }, []);

  const elegir = (cliente: ClienteResponse | null) => {
    onSeleccionar(cliente);
    setAbierto(false);
    setConsulta('');
    setIndiceActivo(0);
  };

  const alTeclear = (evento: React.KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      setAbierto(true);
      setIndiceActivo((actual) => Math.min(actual + 1, resultados.length - 1));
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      setIndiceActivo((actual) => Math.max(actual - 1, 0));
    } else if (evento.key === 'Enter' && desplegado) {
      evento.preventDefault();
      if (resultados[indiceActivo]) elegir(resultados[indiceActivo]);
    } else if (evento.key === 'Escape') {
      setAbierto(false);
    }
  };

  if (seleccionado) {
    return (
      <div className="input-group">
        <label className="input-label">Cliente</label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #C7D2FE',
            backgroundColor: '#EEF2FF',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1E1B4B' }}>
              {seleccionado.nombre} {seleccionado.apellido}
            </p>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '12px',
                color: '#4F46E5',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {seleccionado.telefono && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} /> {seleccionado.telefono}
                </span>
              )}
              {seleccionado.dni && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <IdCard size={12} /> {seleccionado.dni}
                </span>
              )}
              {!seleccionado.telefono && !seleccionado.dni && <span>Cliente registrado</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => elegir(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'transparent',
              color: '#4F46E5',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <X size={14} /> Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="input-group" ref={contenedorRef} style={{ position: 'relative' }}>
      <label className="input-label" htmlFor={`${listaId}-input`}>
        Cliente
      </label>
      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          color="#64748B"
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          id={`${listaId}-input`}
          className="input-field"
          style={{ paddingLeft: '44px' }}
          role="combobox"
          aria-expanded={desplegado}
          aria-controls={listaId}
          aria-activedescendant={
            desplegado && resultados[indiceActivo] ? `${listaId}-opcion-${indiceActivo}` : undefined
          }
          aria-autocomplete="list"
          aria-describedby={`${listaId}-ayuda`}
          autoComplete="off"
          placeholder="¿Ya vino antes? Busca por nombre, teléfono o DNI"
          value={consulta}
          onChange={(evento) => {
            setConsulta(evento.target.value);
            setAbierto(true);
            setIndiceActivo(0);
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={alTeclear}
        />
      </div>

      <span id={`${listaId}-ayuda`} style={{ fontSize: '12px', color: '#94A3B8' }}>
        Si es cliente nuevo, deja el buscador vacío y completa los datos de abajo.
      </span>

      {desplegado && (
        <ul
          id={listaId}
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 20,
            margin: 0,
            padding: '6px',
            listStyle: 'none',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
          }}
        >
          {resultados.length === 0 && (
            <li style={{ padding: '10px 12px', fontSize: '13px', color: '#64748B' }}>
              Ningún cliente coincide con «{consulta.trim()}». Completa los datos de abajo para
              registrarlo.
            </li>
          )}

          {resultados.map((cliente, indice) => (
            <li
              key={cliente.idCliente}
              id={`${listaId}-opcion-${indice}`}
              role="option"
              aria-selected={indice === indiceActivo}
              onMouseEnter={() => setIndiceActivo(indice)}
              onClick={() => elegir(cliente)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: indice === indiceActivo ? '#EEF2FF' : 'transparent',
              }}
            >
              <span style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#1E1B4B' }}>
                {cliente.nombre} {cliente.apellido}
              </span>
              <span style={{ display: 'block', fontSize: '12px', color: '#64748B' }}>
                {[cliente.telefono, cliente.dni].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
              </span>
            </li>
          ))}

          {coincidencias.length > resultados.length && (
            <li style={{ padding: '6px 12px', fontSize: '11px', color: '#94A3B8' }}>
              {coincidencias.length} coincidencias. Escribe más para afinar.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
