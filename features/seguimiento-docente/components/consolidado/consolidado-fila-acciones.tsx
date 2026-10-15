"use client";

import * as React from "react";
import {
  CircleUnlock01Icon,
  Download01Icon,
  EyeIcon,
  LockKeyIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  RefreshIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ConsolidadoResumenDto } from "../../types";

export interface ConsolidadoFilaAccionesProps {
  consolidado: ConsolidadoResumenDto;
  puedeGestionar: boolean;
  onVerDetalle: (consolidado: ConsolidadoResumenDto) => void;
  onVerHistorial: (consolidado: ConsolidadoResumenDto) => void;
  onDescargarFicha: (consolidado: ConsolidadoResumenDto) => void;
  onReabrir?: (consolidado: ConsolidadoResumenDto) => void;
  onCerrar?: (consolidado: ConsolidadoResumenDto) => void;
  onRegistrarDecision?: (consolidado: ConsolidadoResumenDto) => void;
  onGenerarUno?: (consolidado: ConsolidadoResumenDto) => void;
}

/**
 * Menú de acciones contextuales por fila para un consolidado docente (RF-013).
 * Adapta sus opciones según el rol: Subdirector solo consulta e imprime, Director gestiona.
 */
export function ConsolidadoFilaAcciones({
  consolidado,
  puedeGestionar,
  onVerDetalle,
  onVerHistorial,
  onDescargarFicha,
  onReabrir,
  onCerrar,
  onRegistrarDecision,
  onGenerarUno,
}: ConsolidadoFilaAccionesProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Acciones para consolidado de ${consolidado.docenteNombre}`}
          className="text-muted-foreground/70 hover:border-border/60 hover:bg-muted/80 hover:text-foreground focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-foreground transition-all duration-150 focus-visible:ring-1"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={18} strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="border-border/60 bg-popover/95 w-56 rounded-xl p-1.5 shadow-xl backdrop-blur-md"
      >
        <div className="px-2 py-1">
          <p className="text-muted-foreground text-2xs font-bold tracking-wider uppercase">
            Docente
          </p>
          <p className="text-foreground truncate text-xs font-semibold">
            {consolidado.docenteNombre}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setMenuOpen(false);
            onVerDetalle(consolidado);
          }}
          className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
        >
          <HugeiconsIcon icon={EyeIcon} size={15} />
          <span>Ver detalle completo</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setMenuOpen(false);
            onDescargarFicha(consolidado);
          }}
          className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
        >
          <HugeiconsIcon icon={Download01Icon} size={15} />
          <span>Ficha de seguimiento (PDF)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setMenuOpen(false);
            onVerHistorial(consolidado);
          }}
          className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
        >
          <HugeiconsIcon icon={Time02Icon} size={15} />
          <span>Historial de versiones</span>
        </DropdownMenuItem>

        {puedeGestionar && (
          <>
            <DropdownMenuSeparator />

            {onRegistrarDecision && (
              <DropdownMenuItem
                onClick={() => {
                  setMenuOpen(false);
                  onRegistrarDecision(consolidado);
                }}
                className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
              >
                <HugeiconsIcon icon={PencilEdit02Icon} size={15} />
                <span>Registrar decisión</span>
              </DropdownMenuItem>
            )}

            {consolidado.estado === "cerrado" && onReabrir && (
              <DropdownMenuItem
                onClick={() => {
                  setMenuOpen(false);
                  onReabrir(consolidado);
                }}
                className="text-warning-text focus:bg-warning/10 focus:text-warning-text cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
              >
                <HugeiconsIcon icon={CircleUnlock01Icon} size={15} />
                <span>Reabrir consolidado</span>
              </DropdownMenuItem>
            )}

            {consolidado.estado === "reabierto" && onCerrar && (
              <DropdownMenuItem
                onClick={() => {
                  setMenuOpen(false);
                  onCerrar(consolidado);
                }}
                className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
              >
                <HugeiconsIcon icon={LockKeyIcon} size={15} />
                <span>Cerrar consolidado</span>
              </DropdownMenuItem>
            )}

            {onGenerarUno && (
              <DropdownMenuItem
                onClick={() => {
                  setMenuOpen(false);
                  onGenerarUno(consolidado);
                }}
                className="focus:bg-primary/10 focus:text-primary cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium"
              >
                <HugeiconsIcon icon={RefreshIcon} size={15} />
                <span>Regenerar consolidado</span>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
