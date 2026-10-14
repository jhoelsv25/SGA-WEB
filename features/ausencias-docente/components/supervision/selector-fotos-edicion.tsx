"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { LIMITE_MAXIMO_FOTOS } from "@/features/ausencias-docente/consts";
import type { AusenciaFotoDto, MetadatoFotoItem } from "@/features/ausencias-docente/types";
import { validarArchivoFoto } from "@/features/ausencias-docente/utils";
import { FotosExistentesEdicion } from "./fotos-existentes-edicion";
import { FotosNuevasEdicion, type FotoNuevaPreview } from "./fotos-nuevas-edicion";

export interface SelectorFotosEdicionProps {
  fotosExistentes: AusenciaFotoDto[];
  fotosRetiradasIds: string[];
  onFotosRetiradasChange: (ids: string[]) => void;
  onNuevasFotosChange: (fotos: File[], metadatosJson: string) => void;
  disabled?: boolean;
}

/**
 * Gestor modular de evidencias fotográficas para la corrección de ausencias.
 * Respeta el límite de 5 fotos y tamaños táctiles de accesibilidad.
 */
export function SelectorFotosEdicion({
  fotosExistentes,
  fotosRetiradasIds,
  onFotosRetiradasChange,
  onNuevasFotosChange,
  disabled = false,
}: SelectorFotosEdicionProps) {
  const [previewsNuevas, setPreviewsNuevas] = React.useState<FotoNuevaPreview[]>([]);
  const [errorLocal, setErrorLocal] = React.useState<string | null>(null);

  const fotosExistentesActivas = fotosExistentes.filter((f) => !fotosRetiradasIds.includes(f.id));
  const totalFotosActivas = fotosExistentesActivas.length + previewsNuevas.length;
  const cuposDisponibles = Math.max(0, LIMITE_MAXIMO_FOTOS - totalFotosActivas);

  // Limpieza de Object URLs para prevenir fugas de memoria
  React.useEffect(() => {
    return () => {
      previewsNuevas.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, [previewsNuevas]);

  const toggleRetiroFoto = (fotoId: string) => {
    setErrorLocal(null);
    if (fotosRetiradasIds.includes(fotoId)) {
      if (totalFotosActivas >= LIMITE_MAXIMO_FOTOS) {
        setErrorLocal(`Solo se permite adjuntar hasta un máximo de ${LIMITE_MAXIMO_FOTOS} fotos.`);
        return;
      }
      onFotosRetiradasChange(fotosRetiradasIds.filter((id) => id !== fotoId));
    } else {
      onFotosRetiradasChange([...fotosRetiradasIds, fotoId]);
    }
  };

  const handleSeleccionarArchivos = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorLocal(null);
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const listaArchivos = Array.from(files);

    if (listaArchivos.length > cuposDisponibles) {
      setErrorLocal(
        `Solo puede agregar ${cuposDisponibles} foto(s) más (máximo ${LIMITE_MAXIMO_FOTOS} fotos).`,
      );
      event.target.value = "";
      return;
    }

    const nuevosElementos: FotoNuevaPreview[] = [];

    for (const archivo of listaArchivos) {
      const errorArchivo = validarArchivoFoto(archivo);
      if (errorArchivo) {
        setErrorLocal(errorArchivo);
        event.target.value = "";
        return;
      }

      nuevosElementos.push({
        archivo,
        previewUrl: URL.createObjectURL(archivo),
        tomadaEn: new Date().toISOString(),
      });
    }

    const listaActualizada = [...previewsNuevas, ...nuevosElementos];
    setPreviewsNuevas(listaActualizada);

    const archivosFinales = listaActualizada.map((p) => p.archivo);
    const metadatos: MetadatoFotoItem[] = listaActualizada.map((p) => ({ tomadaEn: p.tomadaEn }));
    onNuevasFotosChange(archivosFinales, JSON.stringify(metadatos));

    event.target.value = "";
  };

  const handleQuitarNuevaFoto = (indice: number) => {
    setErrorLocal(null);
    const elementoAEliminar = previewsNuevas[indice];
    if (elementoAEliminar) {
      URL.revokeObjectURL(elementoAEliminar.previewUrl);
    }

    const listaActualizada = previewsNuevas.filter((_, i) => i !== indice);
    setPreviewsNuevas(listaActualizada);

    const archivosFinales = listaActualizada.map((p) => p.archivo);
    const metadatos: MetadatoFotoItem[] = listaActualizada.map((p) => ({ tomadaEn: p.tomadaEn }));
    onNuevasFotosChange(archivosFinales, JSON.stringify(metadatos));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-foreground text-sm font-medium">
          Evidencias fotográficas ({totalFotosActivas}/{LIMITE_MAXIMO_FOTOS})
        </Label>
        <span className="text-2xs text-muted-foreground">PNG o JPG hasta 5 MB</span>
      </div>

      <FotosExistentesEdicion
        fotos={fotosExistentes}
        fotosRetiradasIds={fotosRetiradasIds}
        onToggleRetiro={toggleRetiroFoto}
        disabled={disabled}
      />

      <FotosNuevasEdicion
        previews={previewsNuevas}
        cuposDisponibles={cuposDisponibles}
        onQuitarFoto={handleQuitarNuevaFoto}
        onSeleccionarArchivos={handleSeleccionarArchivos}
        disabled={disabled}
      />

      {errorLocal && <p className="text-destructive text-xs font-medium">{errorLocal}</p>}
    </div>
  );
}
