"use client";

import { useState } from "react";
import { ArrowDown01Icon, Download01Icon, File01Icon, Pdf01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import {
  descargarHorarioSeccionPdf,
  descargarHorariosConsolidadoPdf,
  descargarHorariosExcel,
  guardarBlobDescarga,
} from "../api";

export interface ExportarHorariosDropdownProps {
  gradoId?: string | null;
  seccionId?: string | null;
  docenteId?: string | null;
  label?: string;
  mostrarSeccionActual?: boolean;
  className?: string;
}

export function ExportarHorariosDropdown({
  gradoId = null,
  seccionId = null,
  docenteId = null,
  label = "Exportar",
  mostrarSeccionActual = false,
  className,
}: ExportarHorariosDropdownProps) {
  const [exportando, setExportando] = useState(false);

  const ejecutarDescarga = async (accion: () => Promise<{ blob: Blob; nombreArchivo: string }>) => {
    if (exportando) return;
    setExportando(true);
    try {
      const { blob, nombreArchivo } = await accion();
      guardarBlobDescarga(blob, nombreArchivo);
    } catch {
      toast.error("No se pudo exportar el archivo de horarios.");
    } finally {
      setExportando(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={exportando}
          className={cn(
            "h-11 min-h-11 min-w-11 gap-1.5 rounded-full px-4 text-xs font-semibold",
            className,
          )}
        >
          {exportando ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
          )}
          <span>{label}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-xl p-1.5">
        <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-[11px] font-semibold">
          Formato PDF (grilla visual)
        </DropdownMenuLabel>

        {mostrarSeccionActual && (
          <DropdownMenuItem
            disabled={!seccionId || exportando}
            onSelect={() => {
              if (!seccionId) return;
              void ejecutarDescarga(async () => ({
                blob: await descargarHorarioSeccionPdf(seccionId, docenteId ?? undefined),
                nombreArchivo: "horario-seccion.pdf",
              }));
            }}
            className="cursor-pointer gap-2 rounded-lg text-xs"
          >
            <HugeiconsIcon icon={Pdf01Icon} className="text-primary size-4 shrink-0" />
            <span>Sección actual (PDF)</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          disabled={!gradoId || exportando}
          onSelect={() => {
            if (!gradoId) return;
            void ejecutarDescarga(() => descargarHorariosConsolidadoPdf({ gradoId }));
          }}
          className="cursor-pointer gap-2 rounded-lg text-xs"
        >
          <HugeiconsIcon icon={Pdf01Icon} className="text-primary size-4 shrink-0" />
          <span>Grado seleccionado (PDF)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={exportando}
          onSelect={() => {
            void ejecutarDescarga(() => descargarHorariosConsolidadoPdf());
          }}
          className="cursor-pointer gap-2 rounded-lg text-xs"
        >
          <HugeiconsIcon icon={Pdf01Icon} className="text-primary size-4 shrink-0" />
          <span>Todos los horarios del año (PDF)</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-[11px] font-semibold">
          Formato Excel (.xlsx)
        </DropdownMenuLabel>

        {mostrarSeccionActual && (
          <DropdownMenuItem
            disabled={!seccionId || exportando}
            onSelect={() => {
              if (!seccionId) return;
              void ejecutarDescarga(() => descargarHorariosExcel({ seccionId }));
            }}
            className="cursor-pointer gap-2 rounded-lg text-xs"
          >
            <HugeiconsIcon icon={File01Icon} className="size-4 shrink-0 text-emerald-600" />
            <span>Sección actual (Excel)</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          disabled={!gradoId || exportando}
          onSelect={() => {
            if (!gradoId) return;
            void ejecutarDescarga(() => descargarHorariosExcel({ gradoId }));
          }}
          className="cursor-pointer gap-2 rounded-lg text-xs"
        >
          <HugeiconsIcon icon={File01Icon} className="size-4 shrink-0 text-emerald-600" />
          <span>Grado seleccionado (Excel)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={exportando}
          onSelect={() => {
            void ejecutarDescarga(() => descargarHorariosExcel());
          }}
          className="cursor-pointer gap-2 rounded-lg text-xs"
        >
          <HugeiconsIcon icon={File01Icon} className="size-4 shrink-0 text-emerald-600" />
          <span>Todos los horarios del año (Excel)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
