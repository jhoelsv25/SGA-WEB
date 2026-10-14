"use client";

import * as React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Camera01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { FOTO_ACCEPT } from "@/features/ausencias-docente/consts";

export interface FotoNuevaPreview {
  archivo: File;
  previewUrl: string;
  tomadaEn: string;
}

export interface FotosNuevasEdicionProps {
  previews: FotoNuevaPreview[];
  cuposDisponibles: number;
  onQuitarFoto: (indice: number) => void;
  onSeleccionarArchivos: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Subcomponente para adjuntar nuevas fotos y visualizar sus miniaturas con controles accesibles.
 */
export function FotosNuevasEdicion({
  previews,
  cuposDisponibles,
  onQuitarFoto,
  onSeleccionarArchivos,
  disabled = false,
}: FotosNuevasEdicionProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2.5">
      {/* Miniaturas de nuevas fotos adjuntas */}
      {previews.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-primary text-xs font-semibold">Nuevas fotos por adjuntar:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {previews.map((preview, index) => (
              <div
                key={preview.previewUrl}
                className="border-primary/40 bg-card relative flex flex-col overflow-hidden rounded-xl border p-1.5 shadow-2xs"
              >
                <div className="bg-muted/40 relative aspect-4/3 w-full overflow-hidden rounded-lg">
                  <Image
                    src={preview.previewUrl}
                    alt={`Nueva foto ${index + 1}`}
                    fill
                    sizes="150px"
                    className="object-cover"
                    unoptimized
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 size-8 min-h-8 min-w-8 rounded-full p-0 shadow-xs"
                    onClick={() => onQuitarFoto(index)}
                    disabled={disabled}
                    aria-label={`Eliminar nueva foto ${index + 1}`}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                  </Button>
                </div>
                <p className="text-2xs text-foreground mt-1 truncate font-medium">
                  Nueva foto {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón táctil accesible para agregar fotos si hay cupos */}
      {cuposDisponibles > 0 && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={FOTO_ACCEPT}
            multiple
            className="hidden"
            onChange={onSeleccionarArchivos}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="h-10 w-full gap-2 border-dashed text-xs font-medium"
          >
            <HugeiconsIcon icon={Camera01Icon} className="size-4" />
            <span>Agregar fotos (disponibles: {cuposDisponibles})</span>
          </Button>
        </div>
      )}
    </div>
  );
}
