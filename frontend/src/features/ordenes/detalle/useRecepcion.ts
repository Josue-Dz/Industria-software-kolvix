import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../api/apiError';
import { dispositivosService } from '../../../api/services/dispositivosService';
import { plantillasInspeccionService, recepcionService } from '../../../api/services/recepcionService';
import type {
  ChecklistRecepcionResponse,
  DanoFisico,
  EstadoFisicoGeneral,
  OrdenTrabajoResponse,
  PlantillaInspeccionResponse,
  VistaChasis,
} from '../../../api/types';

// Se usan cuando la categoría no tiene plantilla cargada, para que el chasis
// siga siendo utilizable sin depender del catálogo.
const VISTAS_POR_DEFECTO: VistaChasis[] = [
  { codigo: 'FRONTAL', titulo: 'Frontal', orden: 1 },
  { codigo: 'TRASERA', titulo: 'Trasera', orden: 2 },
  { codigo: 'LATERAL_IZQ', titulo: 'Lateral izq.', orden: 3 },
  { codigo: 'LATERAL_DER', titulo: 'Lateral der.', orden: 4 },
];

export const useRecepcion = (orden: OrdenTrabajoResponse | null, soloLectura: boolean) => {
  const [checklist, setChecklist] = useState<ChecklistRecepcionResponse | null>(null);
  const [plantillas, setPlantillas] = useState<PlantillaInspeccionResponse[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  const [plantillaId, setPlantillaId] = useState('');
  const [danos, setDanos] = useState<DanoFisico[]>([]);
  const [estadoFisico, setEstadoFisico] = useState<EstadoFisicoGeneral | ''>('');
  const [observaciones, setObservaciones] = useState('');
  const [aceptacionCliente, setAceptacionCliente] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [mensajeOk, setMensajeOk] = useState('');

  const ordenId = orden?.idOrden;
  const empresaId = orden?.idEmpresa;
  const dispositivoId = orden?.idDispositivo;

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      if (!ordenId || !empresaId || !dispositivoId) return;

      setIsLoading(true);
      setError('');

      try {
        const [dispositivo, checklistExistente] = await Promise.all([
          dispositivosService.obtener(dispositivoId),
          recepcionService.obtenerPorOrden(ordenId, empresaId),
        ]);
        if (!activo) return;

        setCategoriaId(dispositivo.idCategoria);

        const disponibles = dispositivo.idCategoria
          ? await plantillasInspeccionService.listar(dispositivo.idCategoria)
          : [];
        if (!activo) return;

        setPlantillas(disponibles);
        setChecklist(checklistExistente);
        setDanos(checklistExistente?.danosFisicos ?? []);
        setEstadoFisico(checklistExistente?.estadoFisicoGeneral ?? '');
        setObservaciones(checklistExistente?.observaciones ?? '');
        setAceptacionCliente(checklistExistente?.aceptacionCliente ?? false);
        setPlantillaId(
          checklistExistente?.plantillaInspeccionId
            ? String(checklistExistente.plantillaInspeccionId)
            : disponibles.length === 1
              ? String(disponibles[0].id)
              : ''
        );
      } catch (e) {
        if (activo) setError(getApiErrorMessage(e, 'No se pudo cargar la recepción del equipo.'));
      } finally {
        if (activo) setIsLoading(false);
      }
    };

    void cargar();
    return () => {
      activo = false;
    };
  }, [ordenId, empresaId, dispositivoId]);

  const plantillaSeleccionada = plantillas.find((p) => String(p.id) === plantillaId) ?? null;
  const vistas =
    plantillaSeleccionada && plantillaSeleccionada.vistas.length > 0
      ? plantillaSeleccionada.vistas
      : VISTAS_POR_DEFECTO;

  const guardar = async () => {
    if (!orden || soloLectura) return;

    setIsSaving(true);
    setError('');
    setMensajeOk('');

    try {
      if (!checklist) {
        const creado = await recepcionService.registrar({
          ordenId: orden.idOrden,
          plantillaInspeccionId: plantillaId ? Number(plantillaId) : null,
          estadoFisicoGeneral: estadoFisico || null,
          danosFisicos: danos,
          observaciones,
          aceptacionCliente,
        });
        setChecklist(creado);
      } else {
        if (plantillaId && Number(plantillaId) !== checklist.plantillaInspeccionId) {
          await recepcionService.actualizarPlantilla(checklist.id, Number(plantillaId));
        }
        await recepcionService.actualizarDanos(checklist.id, danos);
        await recepcionService.actualizarObservaciones(checklist.id, observaciones);
        const actualizado = await recepcionService.actualizarDetalles(checklist.id, {
          estadoFisicoGeneral: estadoFisico || null,
          aceptacionCliente,
        });
        setChecklist(actualizado);
      }

      setMensajeOk('Recepción guardada.');
    } catch (e) {
      setError(getApiErrorMessage(e, 'No se pudo guardar la recepción.'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    checklist,
    plantillas,
    categoriaId,
    plantillaId, setPlantillaId,
    vistas,
    danos, setDanos,
    estadoFisico, setEstadoFisico,
    observaciones, setObservaciones,
    aceptacionCliente, setAceptacionCliente,
    isLoading, isSaving, error, mensajeOk,
    guardar,
  };
};
