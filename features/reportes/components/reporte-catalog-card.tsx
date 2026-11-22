"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { cn } from "@/lib/utils";
import type { ReporteCatalogoItem } from "../constants";
import type { CategoriaReporte } from "../types";

const ESTILO_ICONO: Record<CategoriaReporte, string> = {
  academico: "bg-primary/12 text-primary",
  asistencia: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
  indicadores: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  padrones: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
};

interface ReporteCatalogCardProps {
  reporte: ReporteCatalogoItem;
  onSelect: (reporte: ReporteCatalogoItem) => void;
}

export function ReporteCatalogCard({ reporte, onSelect }: ReporteCatalogCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(reporte)}
      className="group bg-card border-border/60 hover:border-primary/40 hover:bg-card/80 focus-visible:ring-primary/50 flex h-full flex-col justify-between gap-4 rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
              ESTILO_ICONO[reporte.categoria],
            )}
          >
            <HugeiconsIcon icon={reporte.icono} className="size-5" />
          </span>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {reporte.formatos.map((fmt) => (
              <StatusBadge key={fmt} tone={fmt === "pdf" ? "warning" : "success"}>
                {fmt === "pdf" ? "PDF" : "Excel"}
              </StatusBadge>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="group-hover:text-primary text-sm font-semibold transition-colors">
            {reporte.titulo}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {reporte.descripcion}
          </p>
        </div>
      </div>

      <div className="border-border/50 flex items-center justify-between gap-2 border-t pt-3">
        <div className="flex flex-wrap items-center gap-1">
          {reporte.chips.map((chip) => (
            <span
              key={chip}
              className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-[10px] font-medium"
            >
              {chip}
            </span>
          ))}
        </div>

        <span className="text-primary inline-flex shrink-0 items-center gap-1 text-xs font-semibold">
          <span>Configurar</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </button>
  );
}
