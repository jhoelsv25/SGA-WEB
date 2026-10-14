"use client";

import * as React from "react";
import { Download01Icon, FileEditIcon, UserCheck01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MENSAJES_CONSOLIDADO } from "../../consts";
import { useDescargarFichaPdf } from "../../hooks";
import type { ConsolidadoResumenDto, SolicitudRevisionResponseDto } from "../../types";

interface MiSeguimientoHeaderProps {
  consolidado?: ConsolidadoResumenDto | null;
  solicitudPendiente?: SolicitudRevisionResponseDto | null;
  onAbrirSolicitud: () => void;
}

/**
 * Cabecera institucional de la vista «Mi seguimiento» (HU3).
 * Incluye acciones para descargar la ficha oficial en PDF y solicitar revisión
 * (deshabilitado si ya existe una solicitud abierta según CP-RF013-14).
 */
export function MiSeguimientoHeader({
  consolidado,
  solicitudPendiente,
  onAbrirSolicitud,
}: MiSeguimientoHeaderProps) {
  const descargarFichaMutation = useDescargarFichaPdf();

  const tieneSolicitudAbierta =
    solicitudPendiente !== null &&
    solicitudPendiente !== undefined &&
    solicitudPendiente.estado === "solicitada";

  const hayConsolidado = Boolean(consolidado);

  const handleDescargarFicha = () => {
    if (!consolidado) return;
    const nombreArchivo = `ficha-seguimiento-${consolidado.periodoNombre.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    descargarFichaMutation.mutate({
      id: consolidado.id,
      nombreArchivo,
    });
  };

  return (
    <PageHeader
      title="Mi seguimiento"
      description="Consolidado de seguimiento docente, métricas por bimestre y solicitudes de revisión."
      icon={UserCheck01Icon}
      breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mi seguimiento" }]}
      actions={
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-2">
            {/* Botón para descargar ficha de seguimiento en PDF (HU4) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDescargarFicha}
              disabled={!hayConsolidado || descargarFichaMutation.isPending}
              className="h-10 min-h-10 gap-2 rounded-full px-4 text-xs font-semibold shadow-2xs"
            >
              {descargarFichaMutation.isPending ? (
                <Spinner className="size-3.5" />
              ) : (
                <HugeiconsIcon icon={Download01Icon} className="size-4" />
              )}
              <span>
                {descargarFichaMutation.isPending
                  ? "Descargando ficha..."
                  : "Ficha de seguimiento (PDF)"}
              </span>
            </Button>

            {/* Botón para solicitar revisión (HU3) */}
            {tieneSolicitudAbierta ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex cursor-not-allowed">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={true}
                      className="h-10 min-h-10 gap-2 rounded-full px-4 text-xs font-semibold opacity-70"
                    >
                      <HugeiconsIcon icon={FileEditIcon} className="size-4" />
                      <span>Solicitar revisión</span>
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  {MENSAJES_CONSOLIDADO.SOLICITUD_REPETIDA}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={onAbrirSolicitud}
                disabled={!hayConsolidado}
                className="h-10 min-h-10 gap-2 rounded-full px-4 text-xs font-semibold shadow-xs"
              >
                <HugeiconsIcon icon={FileEditIcon} className="size-4" />
                <span>Solicitar revisión</span>
              </Button>
            )}
          </div>
        </TooltipProvider>
      }
    />
  );
}
