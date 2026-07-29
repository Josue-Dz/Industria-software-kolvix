import React, { useEffect, useState } from 'react';
import { PlanCard } from './PlanCard';
import { catalogosService } from '../../../api/services/catalogosService';
import type { PlanSuscripcionResponse } from '../../../api/types';

export const PlanesGrid: React.FC = () => {
  const [planes, setPlanes] = useState<PlanSuscripcionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    catalogosService.listarPlanes()
      .then((data) => {
        if (isMounted) setPlanes(data);
      })
      .catch(() => {
        if (isMounted) setError('No se pudieron cargar los planes en este momento.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <p style={{ textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
        Cargando planes...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: 'center', color: '#991B1B', fontSize: '15px', fontWeight: '600' }}>
        {error}
      </p>
    );
  }

  if (planes.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
        No hay planes disponibles por el momento.
      </p>
    );
  }

  return (
    <div className="plans-grid">
      {planes.map((plan) => (
        <PlanCard key={plan.codigo} plan={plan} />
      ))}
    </div>
  );
};
