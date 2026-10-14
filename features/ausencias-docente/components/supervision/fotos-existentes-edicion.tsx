"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { urlDeEvidencia } from "@/features/ausencias-docente/api";
import type { AusenciaFotoDto } from "@/features/ausencias-docente/types";

export interface FotosExistentesEdicionProps {
  fotos: AusenciaFotoDto[];
  fotosRetiradasIds: string[];
  onToggleRetiro: (fotoId: string) => void;
  disabled?: boolean;
}

/**
 * Subcomponente para visualizar y gestionar las fotos previas de una ausencia en edición.
 */
export function FotosExistentesEdicion({
  fotos,
  fotosRetiradasIds,
  onToggleRetiro,
  disabled = false,
}: FotosExistentesEdicionProps) {
  if (fotos.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs font-semibold">Fotos registradas previamente:</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {fotos.map((foto, index) => {
          const estaRetirada = fotosRetiradasIds.includes(foto.id);
          return (
            <div
              key={foto.id}
              className={`border-border/70 relative flex flex-col overflow-hidden rounded-xl border p-1.5 shadow-2xs transition-opacity ${
                estaRetirada ? "bg-muted/60 opacity-50" : "bg-card"
              }`}
            >
              <div className="bg-muted/40 relative aspect-4/3 w-full overflow-hidden rounded-lg">
                <Image
                  src={urlDeEvidencia(foto.archivoUrl)}
                  alt={`Foto previa ${index + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover"
                  unoptimized
                />
                {estaRetirada && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <span className="bg-destructive/90 text-2xs text-destructive-foreground rounded-full px-2 py-0.5 font-bold">
                      Se retirará
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-1.5 flex items-center justify-between gap-1">
                <span className="text-2xs text-muted-foreground truncate font-medium">
                  Foto {index + 1}
                </span>
                <Button
                  type="button"
                  variant={estaRetirada ? "outline" : "ghost"}
                  size="sm"
                  disabled={disabled}
                  onClick={() => onToggleRetiro(foto.id)}
                  className={`h-8 min-h-8 px-2.5 text-xs ${
                    estaRetirada
                      ? "text-primary"
                      : "text-destructive hover:bg-destructive/10 hover:text-destructive"
                  }`}
                  aria-label={
                    estaRetirada
                      ? `Mantener foto previa ${index + 1}`
                      : `Retirar foto previa ${index + 1}`
                  }
                >
                  {estaRetirada ? "Mantener" : "Retirar"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
