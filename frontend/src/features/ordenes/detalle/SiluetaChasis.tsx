import React from 'react';

/**
 * Siluetas normalizadas en un lienzo 100x100, de modo que las coordenadas de
 * un daño (x, y en porcentaje) caen directamente sobre el viewBox.
 */

const TRAZO = '#94A3B8';
const RELLENO = '#F1F5F9';
const DETALLE = '#CBD5E1';
const HUECO = '#FFFFFF';

const esLateral = (vista: string) => vista.startsWith('LATERAL');

/** Rejilla de ventilación o teclado: barras paralelas equiespaciadas. */
const Barras: React.FC<{ x: number; y: number; ancho: number; alto: number; paso: number; total: number }> = ({
  x, y, ancho, alto, paso, total,
}) => (
  <>
    {Array.from({ length: total }, (_, i) => (
      <rect key={i} x={x} y={y + i * paso} width={ancho} height={alto} rx={alto / 2} fill={DETALLE} />
    ))}
  </>
);

const Celular: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return (
      <>
        <rect x={44} y={6} width={12} height={88} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <rect x={56} y={26} width={2} height={10} rx={1} fill={DETALLE} />
        <rect x={56} y={40} width={2} height={16} rx={1} fill={DETALLE} />
      </>
    );
  }
  return (
    <>
      <rect x={31} y={5} width={38} height={90} rx={6} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      {vista === 'TRASERA' ? (
        <>
          <rect x={36} y={11} width={14} height={14} rx={3} fill={DETALLE} />
          <circle cx={40} cy={15} r={2.2} fill={TRAZO} />
          <circle cx={46} cy={21} r={2.2} fill={TRAZO} />
        </>
      ) : (
        <>
          <rect x={35} y={12} width={30} height={72} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
          <rect x={45} y={8} width={10} height={1.6} rx={0.8} fill={DETALLE} />
        </>
      )}
    </>
  );
};

const Tablet: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return <rect x={45} y={14} width={10} height={72} rx={3} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />;
  }
  return (
    <>
      <rect x={21} y={12} width={58} height={76} rx={5} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      {vista === 'TRASERA' ? (
        <rect x={26} y={17} width={12} height={12} rx={3} fill={DETALLE} />
      ) : (
        <rect x={26} y={18} width={48} height={64} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      )}
    </>
  );
};

const Laptop: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return (
      <>
        <rect x={18} y={44} width={64} height={5} rx={2} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <rect x={18} y={20} width={4} height={24} rx={1.5} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      </>
    );
  }
  if (vista === 'TRASERA') {
    return (
      <>
        <rect x={14} y={22} width={72} height={50} rx={3} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <circle cx={50} cy={47} r={6} fill={DETALLE} />
      </>
    );
  }
  return (
    <>
      <rect x={16} y={14} width={68} height={46} rx={3} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      <rect x={20} y={18} width={60} height={38} rx={1.5} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      <path d="M10 62 L90 62 L86 74 L14 74 Z" fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} strokeLinejoin="round" />
      <rect x={36} y={70} width={28} height={2} rx={1} fill={DETALLE} />
    </>
  );
};

const Escritorio: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return (
      <>
        <rect x={26} y={6} width={48} height={88} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <circle cx={50} cy={42} r={15} fill={HUECO} stroke={DETALLE} strokeWidth={0.9} />
        <circle cx={50} cy={42} r={9} fill="none" stroke={DETALLE} strokeWidth={0.8} />
        <circle cx={50} cy={42} r={3} fill={DETALLE} />
        <Barras x={36} y={68} ancho={28} alto={2.4} paso={6} total={4} />
      </>
    );
  }
  if (vista === 'TRASERA') {
    return (
      <>
        <rect x={33} y={5} width={34} height={90} rx={3} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <rect x={37} y={10} width={26} height={15} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
        <circle cx={50} cy={17.5} r={5} fill={DETALLE} />
        <rect x={37} y={29} width={26} height={12} rx={1.5} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
        <rect x={40} y={32} width={5} height={5} rx={1} fill={DETALLE} />
        <rect x={47.5} y={32} width={5} height={5} rx={1} fill={DETALLE} />
        <rect x={55} y={32} width={5} height={5} rx={1} fill={DETALLE} />
        <Barras x={39} y={47} ancho={22} alto={3} paso={8} total={5} />
      </>
    );
  }
  return (
    <>
      <rect x={33} y={5} width={34} height={90} rx={3} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      <rect x={38} y={12} width={24} height={4} rx={1} fill={HUECO} stroke={DETALLE} strokeWidth={0.7} />
      <rect x={38} y={20} width={24} height={4} rx={1} fill={HUECO} stroke={DETALLE} strokeWidth={0.7} />
      <circle cx={44} cy={31} r={2.4} fill={DETALLE} />
      <rect x={51} y={29.6} width={4} height={3} rx={0.8} fill={DETALLE} />
      <rect x={57} y={29.6} width={4} height={3} rx={0.8} fill={DETALLE} />
      <Barras x={39} y={44} ancho={22} alto={3.4} paso={8} total={6} />
    </>
  );
};

const Televisor: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return (
      <>
        <rect x={46} y={20} width={8} height={44} rx={2} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <rect x={40} y={78} width={20} height={3} rx={1.5} fill={DETALLE} />
      </>
    );
  }
  return (
    <>
      <rect x={8} y={18} width={84} height={52} rx={3} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      {vista === 'TRASERA' ? (
        <>
          <rect x={18} y={28} width={28} height={22} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
          <Barras x={54} y={28} ancho={26} alto={2.4} paso={6} total={5} />
        </>
      ) : (
        <rect x={12} y={22} width={76} height={44} rx={1.5} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      )}
      <rect x={44} y={70} width={12} height={9} fill={DETALLE} />
      <rect x={30} y={79} width={40} height={3.5} rx={1.75} fill={TRAZO} />
    </>
  );
};

const Consola: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return <rect x={40} y={28} width={20} height={44} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />;
  }
  return (
    <>
      <rect x={13} y={30} width={74} height={40} rx={7} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      {vista === 'TRASERA' ? (
        <>
          <rect x={22} y={42} width={16} height={9} rx={2} fill={DETALLE} />
          <rect x={44} y={42} width={10} height={9} rx={2} fill={DETALLE} />
          <rect x={60} y={42} width={16} height={9} rx={2} fill={DETALLE} />
        </>
      ) : (
        <>
          <rect x={20} y={46} width={30} height={3} rx={1.5} fill={DETALLE} />
          <circle cx={72} cy={50} r={4} fill={DETALLE} />
        </>
      )}
    </>
  );
};

const Electrodomestico: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return (
      <>
        <rect x={26} y={26} width={48} height={48} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <Barras x={34} y={36} ancho={32} alto={2.4} paso={7} total={5} />
      </>
    );
  }
  if (vista === 'TRASERA') {
    return (
      <>
        <rect x={9} y={26} width={82} height={48} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <Barras x={18} y={34} ancho={46} alto={2.6} paso={6.5} total={6} />
        <path d="M78 74 q1 12 -7 17" fill="none" stroke={TRAZO} strokeWidth={1.8} strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <rect x={9} y={26} width={82} height={48} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      <rect x={14} y={31} width={44} height={38} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      <rect x={59} y={32} width={3} height={36} rx={1.5} fill={DETALLE} />
      <rect x={65} y={31} width={21} height={38} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      <circle cx={75.5} cy={40} r={4.5} fill={DETALLE} />
      {[0, 1, 2].map((fila) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${fila}-${col}`}
            x={68.5 + col * 5.5}
            y={50 + fila * 5.5}
            width={3.6}
            height={3.6}
            rx={0.8}
            fill={DETALLE}
          />
        ))
      )}
    </>
  );
};

const Impresora: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return (
      <>
        <rect x={32} y={26} width={36} height={7} rx={2} fill={RELLENO} stroke={TRAZO} strokeWidth={1} />
        <rect x={28} y={33} width={44} height={31} rx={3} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <rect x={30} y={64} width={40} height={8} rx={2} fill={RELLENO} stroke={TRAZO} strokeWidth={1} />
      </>
    );
  }
  if (vista === 'TRASERA') {
    return (
      <>
        <rect x={13} y={33} width={74} height={31} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <rect x={22} y={39} width={56} height={18} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
        <rect x={30} y={66} width={9} height={4.5} rx={1} fill={DETALLE} />
        <rect x={43} y={66} width={6} height={4.5} rx={1} fill={DETALLE} />
        <path d="M72 66 q2 11 -7 15" fill="none" stroke={TRAZO} strokeWidth={1.8} strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <rect x={31} y={19} width={38} height={8} rx={1} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      <rect x={20} y={26} width={60} height={7} rx={2} fill={RELLENO} stroke={TRAZO} strokeWidth={1.1} />
      <rect x={13} y={33} width={74} height={31} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      <rect x={57} y={38} width={24} height={12} rx={2} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      <rect x={60} y={41} width={11} height={6} rx={1} fill={DETALLE} />
      <circle cx={77} cy={44} r={2.1} fill={DETALLE} />
      <rect x={20} y={53} width={30} height={3.2} rx={1.6} fill={DETALLE} />
      <rect x={18} y={64} width={64} height={8} rx={2} fill={RELLENO} stroke={TRAZO} strokeWidth={1.1} />
      <rect x={38} y={72} width={24} height={3.4} rx={1.7} fill={DETALLE} />
    </>
  );
};

const Generico: React.FC<{ vista: string }> = ({ vista }) => {
  if (esLateral(vista)) {
    return (
      <>
        <rect x={40} y={20} width={20} height={60} rx={4} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
        <Barras x={44} y={32} ancho={12} alto={2.2} paso={6} total={4} />
      </>
    );
  }
  return (
    <>
      <rect x={16} y={20} width={68} height={60} rx={7} fill={RELLENO} stroke={TRAZO} strokeWidth={1.2} />
      <rect x={23} y={27} width={54} height={46} rx={4} fill={HUECO} stroke={DETALLE} strokeWidth={0.8} />
      {[[27, 31], [73, 31], [27, 69], [73, 69]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.7} fill={DETALLE} />
      ))}
      {vista === 'TRASERA' && (
        <>
          <rect x={36} y={40} width={28} height={13} rx={2} fill={DETALLE} />
          <Barras x={38} y={58} ancho={24} alto={2.2} paso={5} total={2} />
        </>
      )}
    </>
  );
};

// Ids de categoria_dispositivos, que es catalogo global.
const POR_CATEGORIA: Record<number, React.FC<{ vista: string }>> = {
  1: Celular,
  2: Laptop,
  3: Escritorio,
  4: Tablet,
  5: Consola,
  6: Televisor,
  7: Electrodomestico,
  8: Impresora,
  9: Generico,
};

interface SiluetaChasisProps {
  categoriaId: number | null;
  vista: string;
}

export const SiluetaChasis: React.FC<SiluetaChasisProps> = ({ categoriaId, vista }) => {
  const Silueta = (categoriaId && POR_CATEGORIA[categoriaId]) || Generico;
  return <Silueta vista={vista} />;
};
