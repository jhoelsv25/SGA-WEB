"use client";

import * as React from "react";
import Image from "next/image";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { FotoEvidenciaLocal } from "./types";

interface MiniaturaFotoProps {
  foto: FotoEvidenciaLocal;
  index: number;
  onQuitar: (id: string) => void;
  disabled?: boolean;
}

/**
 * Muestra la miniatura de una evidencia fotográfica adjunta con sus metadatos
 * y un botón táctil accesible con tamaño estándar (min-h-10) para removerla.
 */
export function MiniaturaFoto({ foto, index, onQuitar, disabled = false }: MiniaturaFotoProps) {
  const tamanoKb = Math.round(foto.archivo.size / 1024);
  const horaTomada = new Date(foto.tomadaEn).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-card border-border/70 relative flex flex-col gap-2 rounded-xl border p-2 shadow-2xs">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
        <Image
          src={foto.previewUrl}
          alt={`Evidencia ${index + 1}`}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="text-muted-foreground text-2xs flex items-center justify-between px-0.5">
        <span>{horaTomada}</span>
        <span>{tamanoKb} KB</span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onQuitar(foto.id)}
        disabled={disabled}
        aria-label={`Quitar foto ${index + 1}`}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive min-h-10 w-full gap-1.5 rounded-full text-xs font-semibold"
      >
        <HugeiconsIcon icon={Delete02Icon} className="size-3.5" aria-hidden="true" />
        <span>Quitar</span>
      </Button>
    </div>
  );
}
