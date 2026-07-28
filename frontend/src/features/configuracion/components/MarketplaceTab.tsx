import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Store, EyeOff, Star, Plus, X, Info } from 'lucide-react';
import { PerfilMarketplaceForm } from './PerfilMarketplaceForm';
import type { ConfiguracionController } from '../useConfiguracion';

export const MarketplaceTab: React.FC<{ c: ConfiguracionController }> = ({ c }) => {
  const {
    empresa, perfilMarketplace, categoriasServicio, catalogoCategorias, isSaving,
    guardarPerfilMarketplace, cambiarVisibilidadMarketplace,
    agregarCategoriaServicio, quitarCategoriaServicio,
  } = c;

  const [categoriaNueva, setCategoriaNueva] = useState('');

  const visible = perfilMarketplace?.marketplaceVisible ?? false;
  const perfilCreado = perfilMarketplace !== null;

  // Categorías del catálogo que el taller todavía no atiende.
  const categoriasDisponibles = catalogoCategorias.filter(
    cat => !categoriasServicio.some(cs => cs.categoriaId === cat.id)
  );

  const handleAgregarCategoria = async () => {
    if (categoriaNueva === '') return;
    await agregarCategoriaServicio(Number(categoriaNueva));
    setCategoriaNueva('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Visibilidad */}
      <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: visible ? '#DCFCE7' : '#F1F5F9',
              color: visible ? '#15803D' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {visible ? <Store size={22} /> : <EyeOff size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                Visibilidad en el marketplace
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                {visible
                  ? 'Tu taller aparece en el buscador público y los clientes pueden encontrarlo.'
                  : 'Tu taller está oculto: no aparece en el buscador público de talleres.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => cambiarVisibilidadMarketplace(!visible)}
            disabled={isSaving || !perfilCreado}
            title={!perfilCreado ? 'Guarda primero el perfil de tu taller' : undefined}
            style={{
              width: '56px',
              height: '30px',
              borderRadius: '15px',
              backgroundColor: visible ? '#16A34A' : '#CBD5E1',
              border: 'none',
              cursor: !perfilCreado || isSaving ? 'not-allowed' : 'pointer',
              opacity: !perfilCreado ? 0.5 : 1,
              position: 'relative',
              flexShrink: 0,
              transition: 'background-color 0.2s ease'
            }}
          >
            <span style={{
              position: 'absolute',
              top: '3px',
              left: visible ? '29px' : '3px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              transition: 'left 0.2s ease'
            }} />
          </button>
        </div>

        {!perfilCreado && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: '#EEF2FF',
            border: '1px solid #C7D2FE',
            borderRadius: '12px',
            padding: '14px 16px',
            marginTop: '20px'
          }}>
            <Info size={18} color="#3730A3" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '13px', color: '#3730A3', margin: 0, lineHeight: 1.5 }}>
              Todavía no has creado el perfil público de tu taller. Completa los datos de abajo y
              guarda; después podrás publicarlo con este interruptor.
            </p>
          </div>
        )}

        {perfilMarketplace && (
          <div style={{ display: 'flex', gap: '32px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>CALIFICACIÓN</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: '800', color: '#1E1B4B' }}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                {Number(perfilMarketplace.calificacionPromedio).toFixed(2)}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>RESEÑAS</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B' }}>
                {perfilMarketplace.totalReviews}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Perfil público: se remonta al cargar o cambiar el perfil del backend. */}
      <PerfilMarketplaceForm
        key={perfilMarketplace?.id ?? 'nuevo'}
        empresa={empresa}
        perfil={perfilMarketplace}
        isSaving={isSaving}
        onGuardar={guardarPerfilMarketplace}
      />

      {/* Categorías atendidas */}
      <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
          Categorías que atiende tu taller
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 20px 0' }}>
          Los clientes filtran el marketplace por estas categorías.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {categoriasServicio.map((cs) => (
            <span
              key={cs.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '20px',
                backgroundColor: '#EDE9FE',
                color: '#3730A3',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              {cs.categoriaNombre}
              <button
                onClick={() => quitarCategoriaServicio(cs)}
                title={`Quitar ${cs.categoriaNombre}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366F1', display: 'flex', padding: 0 }}
              >
                <X size={14} />
              </button>
            </span>
          ))}

          {categoriasServicio.length === 0 && (
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>
              Aún no has seleccionado categorías. Sin ellas tu taller no aparece en las búsquedas por tipo de equipo.
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ flex: 1, maxWidth: '360px', marginBottom: 0 }}>
            <label className="input-label">Agregar categoría</label>
            <select
              className="input-field"
              value={categoriaNueva}
              onChange={(e) => setCategoriaNueva(e.target.value)}
              disabled={categoriasDisponibles.length === 0}
            >
              <option value="">
                {categoriasDisponibles.length === 0 ? 'Ya agregaste todas las categorías' : '-- Seleccionar --'}
              </option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            icon={<Plus size={16} />}
            disabled={categoriaNueva === ''}
            onClick={handleAgregarCategoria}
          >
            Agregar
          </Button>
        </div>
      </Card>

    </div>
  );
};
