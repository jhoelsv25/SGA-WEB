import * as React from "react";
import Image from "next/image";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { urlDeEvidencia } from "../../api";
import type { AusenciaFotoDto } from "../../types";

interface DetalleAusenciaFotosProps {
  fotos: AusenciaFotoDto[];
  onVerFoto: (foto: AusenciaFotoDto) => void;
}

/**
 * Galería de evidencias fotográficas adjuntas para el modal de detalle de ausencia.
 */
export function DetalleAusenciaFotos({ fotos, onVerFoto }: DetalleAusenciaFotosProps) {
  return (
    <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
          <HugeiconsIcon icon={Image01Icon} className="size-3.5" />
          Evidencias fotográficas ({fotos.length})
        </p>
      </div>

      {fotos.length === 0 ? (
        <p className="text-muted-foreground mt-3 text-xs">
          No se adjuntaron fotos al registrar esta ausencia.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {fotos.map((foto) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => onVerFoto(foto)}
              className="group border-border/70 bg-muted/30 hover:border-primary focus-visible:ring-primary relative aspect-square overflow-hidden rounded-xl border transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Ver foto de evidencia en tamaño completo"
            >
              <Image
                src={urlDeEvidencia(foto.archivoUrl)}
                alt="Evidencia de ausencia docente"
                fill
                unoptimized
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 200px"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              <span className="text-2xs absolute right-1.5 bottom-1.5 rounded-md bg-black/60 px-1.5 py-0.5 font-semibold text-white backdrop-blur-xs">
                Ampliar
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
