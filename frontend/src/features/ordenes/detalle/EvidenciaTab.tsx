import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Camera } from 'lucide-react';
import { evidenciasService } from '../../../api/services/evidenciasService';
import { formatDate } from './shared';
import type { DetalleOrdenController } from './useDetalleOrden';

export const EvidenciaTab: React.FC<{ d: DetalleOrdenController }> = ({ d }) => {
  const { albumes, evidencias, isUploading, fileInputRef, handleSeleccionarFoto, handleArchivoSeleccionado } = d;

  return (
    <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleArchivoSeleccionado}
      />

      {isUploading && (
        <div style={{ backgroundColor: '#EEF2FF', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#3730A3', fontWeight: '700' }}>
          Subiendo evidencia...
        </div>
      )}

      {albumes.map((album) => {
        const fotos = evidencias.filter((e) => e.albumId === album.id);
        return (
          <div key={album.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  {album.titulo}{album.obligatorio ? ' *' : ''}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{album.descripcion}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={<Camera size={16} />}
                disabled={isUploading}
                onClick={() => handleSeleccionarFoto(album.id)}
              >
                Agregar foto
              </Button>
            </div>

            <div className="grid-4">
              {fotos.map((foto) => (
                <div key={foto.id} style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', backgroundColor: '#FAFAFD' }}>
                  <img
                    src={evidenciasService.resolverUrlImagen(foto.urlImagen)}
                    alt={foto.descripcion ?? foto.etiqueta ?? 'Evidencia'}
                    style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: '6px 10px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {foto.descripcion ?? foto.etiqueta ?? formatDate(foto.fechaSubida)}
                    </span>
                  </div>
                </div>
              ))}

              {fotos.length === 0 && (
                <div style={{ border: '1px dashed #CBD5E1', borderRadius: '14px', height: '120px', backgroundColor: '#FAFAFD', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Camera size={22} color="#64748B" />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Sin fotos</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {albumes.length === 0 && (
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
          No se pudieron cargar los álbumes de evidencia.
        </p>
      )}
    </Card>
  );
};
