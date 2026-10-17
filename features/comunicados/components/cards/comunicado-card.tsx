"use client";

import * as React from "react";
import {
  ArchiveIcon,
  Calendar03Icon,
  FileAttachmentIcon,
  Megaphone01Icon,
  SentIcon,
  UserCheck01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters/date";
import {
  COMUNICADO_DIRIGIDO_LABELS,
  COMUNICADO_ESTADO_CONFIG,
  COMUNICADO_PRIORIDAD_CONFIG,
} from "../../constants";
import type { ComunicadoItem } from "../../types";

export interface ComunicadoCardProps {
  comunicado: ComunicadoItem;
  currentUserId?: string;
  onVerDetalle: (comunicado: ComunicadoItem) => void;
  onVerAvanceLectura: (comunicado: ComunicadoItem) => void;
  onPublicar?: (comunicado: ComunicadoItem) => void;
  onArchivar?: (comunicado: ComunicadoItem) => void;
  isPublishing?: boolean;
  isArchiving?: boolean;
}

export function ComunicadoCard({
  comunicado,
  currentUserId,
  onVerDetalle,
  onVerAvanceLectura,
  onPublicar,
  onArchivar,
  isPublishing,
  isArchiving,
}: ComunicadoCardProps) {
  const esAutor = currentUserId ? comunicado.autorId === currentUserId : true;
  const estadoConfig = COMUNICADO_ESTADO_CONFIG[comunicado.estado];
  const prioridadConfig = COMUNICADO_PRIORIDAD_CONFIG[comunicado.prioridad];
  const publicoLabel = COMUNICADO_DIRIGIDO_LABELS[comunicado.dirigidoA];

  const alcanceText = React.useMemo(() => {
    if (comunicado.seccionNombre && comunicado.gradoNumero) {
      return `${comunicado.gradoNumero}° ${comunicado.seccionNombre}`;
    }
    if (comunicado.gradoNumero) {
      return `${comunicado.gradoNumero}° Grado`;
    }
    return "Todo el Colegio";
  }, [comunicado.gradoNumero, comunicado.seccionNombre]);

  return (
    <Card className="border-border/80 hover:border-primary/40 overflow-hidden border transition-all hover:shadow-xs">
      <CardContent className="space-y-4 p-5">
        {/* Cabecera del comunicado */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn("text-[11px] font-medium", estadoConfig.badgeClass)}
              >
                {estadoConfig.label}
              </Badge>
              <Badge variant="outline" className={cn("text-[11px]", prioridadConfig.badgeClass)}>
                {prioridadConfig.label}
              </Badge>
              <Badge variant="secondary" className="text-muted-foreground text-[11px]">
                {publicoLabel}
              </Badge>
              <Badge variant="outline" className="bg-muted/40 text-[11px]">
                {alcanceText}
              </Badge>
            </div>

            <h3
              onClick={() => onVerDetalle(comunicado)}
              className="text-foreground hover:text-primary cursor-pointer text-base font-semibold tracking-tight transition-colors"
            >
              {comunicado.titulo}
            </h3>
          </div>

          <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
            <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
            <span>{formatDate(comunicado.publicadoEn || comunicado.creadoEn, "dd MMM yyyy")}</span>
          </div>
        </div>

        {/* Resumen del contenido */}
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {comunicado.contenido}
        </p>

        {/* Datos del autor y adjunto */}
        <div className="border-border/40 text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={UserIcon} className="text-primary/70 size-3.5" />
            <span>
              Por: <strong className="text-foreground font-medium">{comunicado.autorNombre}</strong>
            </span>
          </div>

          {comunicado.adjuntoUrl && (
            <a
              href={comunicado.adjuntoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
            >
              <HugeiconsIcon icon={FileAttachmentIcon} className="size-3.5" />
              <span>Ver archivo adjunto</span>
            </a>
          )}
        </div>

        {/* HU2: Control de lectura si está publicado y es autor */}
        {comunicado.estado === "publicado" && esAutor && (
          <div className="bg-muted/30 border-border/50 space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <HugeiconsIcon icon={UserCheck01Icon} className="size-3.5 text-emerald-500" />
                Avance de lectura:
              </span>
              <span className="text-foreground font-semibold">
                {comunicado.totalLeidos} de {comunicado.totalDestinatarios} leídos (
                {comunicado.porcentajeLectura}%)
              </span>
            </div>
            <Progress value={comunicado.porcentajeLectura} className="h-1.5" />
          </div>
        )}

        {/* Acciones del card */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {comunicado.estado === "borrador" && onPublicar && esAutor && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onPublicar(comunicado)}
              disabled={isPublishing}
              className="h-8 gap-1.5 bg-emerald-600 text-xs hover:bg-emerald-700"
            >
              <HugeiconsIcon icon={SentIcon} className="size-3.5" />
              {isPublishing ? "Publicando..." : "Publicar"}
            </Button>
          )}

          {comunicado.estado === "publicado" && esAutor && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onVerAvanceLectura(comunicado)}
                className="h-8 gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={UserCheck01Icon} className="size-3.5 text-emerald-600" />
                Control de lectura
              </Button>

              {onArchivar && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onArchivar(comunicado)}
                  disabled={isArchiving}
                  className="text-muted-foreground h-8 gap-1.5 text-xs hover:text-amber-600"
                >
                  <HugeiconsIcon icon={ArchiveIcon} className="size-3.5" />
                  Archivar
                </Button>
              )}
            </>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onVerDetalle(comunicado)}
            className="h-8 gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={Megaphone01Icon} className="size-3.5" />
            Ver comunicado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
