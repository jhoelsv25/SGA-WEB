"use client";

import * as React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Image01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { urlDeEvidencia } from "@/features/ausencias-docente/api";
import type { AusenciaFotoDto } from "@/features/ausencias-docente/types";
import { formatDateTime } from "@/lib/formatters/date";

interface GaleriaEvidenciasProps {
  fotos: AusenciaFotoDto[];
  className?: string;
}

/**
 * Galería accesible de evidencias fotográficas adjuntas a una ausencia.
 * Permite previsualizar miniaturas y ampliar la imagen en un modal con datos de captura.
 */
export function GaleriaEvidencias({ fotos, className }: GaleriaEvidenciasProps) {
  const [fotoSeleccionada, setFotoSeleccionada] = React.useState<AusenciaFotoDto | null>(null);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="border-border/60 bg-muted/20 text-muted-foreground flex items-center gap-2.5 rounded-xl border p-3.5 text-xs">
        <HugeiconsIcon icon={Image01Icon} className="size-4.5 shrink-0" />
        <span>No se adjuntaron evidencias fotográficas para este registro.</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {fotos.map((foto, index) => {
          const urlCompleta = urlDeEvidencia(foto.archivoUrl);
          const fechaCaptura = foto.tomadaEn ? formatDateTime(foto.tomadaEn) : null;

          return (
            <div
              key={foto.id || index}
              className="group border-border/70 bg-card hover:border-primary/50 relative flex flex-col overflow-hidden rounded-xl border shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setFotoSeleccionada(foto)}
                className="bg-muted/40 focus-visible:ring-primary relative aspect-4/3 w-full cursor-zoom-in overflow-hidden focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`Ver foto de evidencia ${index + 1} ampliada`}
              >
                <Image
                  src={urlCompleta}
                  alt={`Evidencia fotográfica ${index + 1} de la ausencia`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="bg-background/90 text-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-xs">
                    <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
                    Ampliar
                  </span>
                </div>
              </button>

              <div className="border-border/50 border-t p-2 text-xs">
                <p className="text-foreground font-medium">Foto {index + 1}</p>
                {fechaCaptura ? (
                  <p className="text-2xs text-muted-foreground">Captura: {fechaCaptura}</p>
                ) : (
                  <p className="text-2xs text-muted-foreground">Sin hora registrada</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={Boolean(fotoSeleccionada)}
        onOpenChange={(abierto) => !abierto && setFotoSeleccionada(null)}
      >
        <DialogContent
          className="border-border/60 max-w-2xl gap-3 p-4 sm:p-6"
          aria-describedby="descripcion-evidencia-ampliada"
        >
          <div className="flex items-center justify-between border-b pb-2">
            <DialogTitle className="text-base font-semibold">
              Evidencia fotográfica ampliada
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-8 min-h-8 min-w-8 p-0"
              onClick={() => setFotoSeleccionada(null)}
              aria-label="Cerrar vista previa"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
            </Button>
          </div>

          <p id="descripcion-evidencia-ampliada" className="sr-only">
            Visualización detallada de la foto adjunta a la ausencia docente.
          </p>

          {fotoSeleccionada && (
            <div className="space-y-3">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border bg-black/90">
                <Image
                  src={urlDeEvidencia(fotoSeleccionada.archivoUrl)}
                  alt="Evidencia fotográfica ampliada"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain"
                  unoptimized
                />
              </div>

              {fotoSeleccionada.tomadaEn && (
                <div className="bg-muted/40 text-muted-foreground rounded-lg p-2.5 text-xs">
                  <span className="text-foreground font-semibold">Fecha y hora de captura:</span>{" "}
                  {formatDateTime(fotoSeleccionada.tomadaEn)}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
