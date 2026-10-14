"use client";

import * as React from "react";
import { EyeIcon, FileEditIcon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/formatters/date";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "../../consts";
import type { AusenciaResponseDto } from "../../types";
import { esDescargoPermitido, formatearMinutos } from "../../utils";
import { EstadoAusenciaBadge } from "./estado-ausencia-badge";

interface MisAusenciasTablaProps {
  ausencias: AusenciaResponseDto[];
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onAbrirDescargo: (ausencia: AusenciaResponseDto) => void;
}

/**
 * Tabla institucional para visualización de ausencias docentes en pantallas medianas y grandes.
 */
export function MisAusenciasTabla({
  ausencias,
  onVerDetalle,
  onAbrirDescargo,
}: MisAusenciasTablaProps) {
  return (
    <div className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-2xs">
      <Table aria-label="Historial de mis ausencias docentes">
        <caption className="sr-only">
          Historial de ausencias registradas en sesiones de clase y plazos de descargo
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha y horario</TableHead>
            <TableHead>Curso y sección</TableHead>
            <TableHead>Tramo ausente</TableHead>
            <TableHead>Motivo / Observación</TableHead>
            <TableHead>Fotos</TableHead>
            <TableHead>Estado / Descargo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ausencias.map((ausencia) => {
            const fechaSesion = formatDate(ausencia.sesion.fecha, "dd/MM/yyyy");
            const etiquetaMotivo = ETIQUETAS_MOTIVO_AUSENCIA[ausencia.motivo] || ausencia.motivo;
            const puedeDescargar = esDescargoPermitido(ausencia);

            return (
              <TableRow key={ausencia.id} className="hover:bg-muted/30">
                <TableCell className="text-foreground font-mono text-xs">
                  <span className="font-semibold">{fechaSesion}</span>
                  <br />
                  <span className="text-muted-foreground">
                    {ausencia.sesion.horaInicio}–{ausencia.sesion.horaFin}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="text-foreground font-semibold">{ausencia.sesion.cursoNombre}</p>
                  <p className="text-muted-foreground text-xs">{ausencia.sesion.seccionNombre}</p>
                </TableCell>
                <TableCell>
                  <span className="text-foreground font-mono text-xs font-bold">
                    {ausencia.horaDesde}–{ausencia.horaHasta}
                  </span>
                  <p className="text-muted-foreground text-xs font-semibold">
                    {formatearMinutos(ausencia.minutos)}
                  </p>
                </TableCell>
                <TableCell className="max-w-56">
                  <p className="text-foreground text-xs font-semibold">{etiquetaMotivo}</p>
                  {ausencia.observacion ? (
                    <p className="text-muted-foreground line-clamp-2 text-xs italic">
                      {ausencia.observacion}
                    </p>
                  ) : (
                    <span className="text-muted-foreground/60 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {ausencia.fotos.length > 0 ? (
                    <span className="border-border/70 bg-muted/40 text-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                      <HugeiconsIcon icon={Image01Icon} className="size-3" />
                      <span>{ausencia.fotos.length}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <EstadoAusenciaBadge ausencia={ausencia} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onVerDetalle(ausencia)}
                      className="h-9 min-h-9 gap-1 rounded-full px-3 text-xs font-medium"
                      aria-label={`Ver detalle de la ausencia de ${ausencia.sesion.cursoNombre}`}
                    >
                      <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
                      <span>Detalle</span>
                    </Button>
                    {!ausencia.anulada && ausencia.descargo === null && puedeDescargar && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onAbrirDescargo(ausencia)}
                        className="h-9 min-h-9 gap-1 rounded-full px-3 text-xs font-semibold"
                        aria-label={`Presentar descargo para la sesión de ${ausencia.sesion.cursoNombre}`}
                      >
                        <HugeiconsIcon icon={FileEditIcon} className="size-3.5" />
                        <span>Descargo</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
