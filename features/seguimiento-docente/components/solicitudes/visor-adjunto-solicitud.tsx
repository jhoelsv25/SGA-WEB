"use client";

import * as React from "react";
import Image from "next/image";
import {
  Attachment01Icon,
  Download01Icon,
  EyeIcon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { urlDeAdjunto } from "../../api";

export interface VisorAdjuntoSolicitudProps {
  adjuntoUrl?: string | null;
  adjuntoNombre?: string | null;
}

/**
 * Visualizador y descargador de evidencias y documentos adjuntos
 * presentados por el docente en su solicitud de revisión.
 */
export function VisorAdjuntoSolicitud({ adjuntoUrl, adjuntoNombre }: VisorAdjuntoSolicitudProps) {
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = React.useState(false);

  if (!adjuntoUrl) {
    return (
      <div className="border-border/50 bg-muted/20 text-muted-foreground flex items-center gap-2 rounded-lg border p-3 text-xs italic">
        <HugeiconsIcon icon={Attachment01Icon} className="size-4 shrink-0 opacity-60" />
        <span>No se adjuntó ningún archivo de sustento.</span>
      </div>
    );
  }

  const urlCompleta = urlDeAdjunto(adjuntoUrl);
  const nombreLimpio = adjuntoNombre || "sustento-solicitud";
  const extension = nombreLimpio.toLowerCase().split(".").pop() ?? "";
  const esImagen = ["png", "jpg", "jpeg", "webp"].includes(extension);
  const esPdf = extension === "pdf";

  return (
    <div className="border-border/70 bg-card flex flex-col gap-3 rounded-xl border p-3.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="border-border/60 bg-muted/60 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border">
            <HugeiconsIcon icon={FileAttachmentIcon} className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate text-xs font-semibold">{nombreLimpio}</p>
            <p className="text-muted-foreground text-2xs tracking-wider uppercase">
              {esImagen ? "Imagen de evidencia" : esPdf ? "Documento PDF" : "Archivo adjunto"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {(esImagen || esPdf) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMostrarVistaPrevia((prev) => !prev)}
              className="h-8 gap-1.5 px-2.5 text-xs font-medium"
            >
              <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
              <span>{mostrarVistaPrevia ? "Ocultar" : "Vista previa"}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 px-2.5 text-xs font-medium"
          >
            <a href={urlCompleta} target="_blank" rel="noopener noreferrer" download={nombreLimpio}>
              <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
              <span>Descargar</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Vista previa desplegable */}
      {mostrarVistaPrevia && (
        <div className="border-border/60 bg-muted/30 overflow-hidden rounded-lg border p-2">
          {esImagen ? (
            <div className="relative aspect-4/3 max-h-80 w-full overflow-hidden rounded-md">
              <Image
                src={urlCompleta}
                alt={nombreLimpio}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-contain"
              />
            </div>
          ) : esPdf ? (
            <iframe
              src={urlCompleta}
              title={nombreLimpio}
              className="h-80 w-full rounded border-0 bg-white"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
