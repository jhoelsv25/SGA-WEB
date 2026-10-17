"use client";

import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";

interface DashboardChartEmptyProps {
  title?: string;
  description?: string;
  icon?: IconSvgElement;
  className?: string;
}

export function DashboardChartEmpty({
  title = "Sin datos disponibles",
  description = "No hay registros registrados en el período o rango seleccionado.",
  icon = Folder01Icon,
  className,
}: DashboardChartEmptyProps) {
  return (
    <div
      className={cn(
        "border-border/60 bg-muted/15 flex h-64 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center",
        className,
      )}
    >
      <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl shadow-2xs">
        <HugeiconsIcon icon={icon} className="size-6" />
      </div>

      <h4 className="text-foreground mt-3 text-sm font-semibold tracking-tight">{title}</h4>

      {description && (
        <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">{description}</p>
      )}
    </div>
  );
}
